from flask import Flask, jsonify, abort
from flask_caching import Cache
from flask_cors import CORS
import requests
import json
import sys
import os

from datetime import datetime

# ----------------------------------------------------------------------------
# App configuration
# ----------------------------------------------------------------------------

# On IBM Cloud Cloud Foundry, get the port number from the environment variable PORT
# When running this app on the local machine, default the port to 8000
port = int(os.getenv('PORT', 8000))

app = Flask(__name__)
cache = Cache(app,config={'CACHE_TYPE': 'simple'})  
CORS(app)
try:
    with open('cloudant.credentials.json', 'r') as f:
        db_creds = json.load(f)
except Exception as err:
    sys.exit(err)

# ----------------------------------------------------------------------------
# Routes
# ----------------------------------------------------------------------------

@app.route('/today')
@cache.cached(timeout=300)
def today():
    """
    Returns sentiments and price data for top ten coins.
    """
    current_url = 'https://min-api.cryptocompare.com/data/pricemultifull'
    historical_url = 'https://min-api.cryptocompare.com/data/histohour'

    try:
        today_summary = _get_today_summary()
    except Exception as err:
        print(err)
        return abort(500)

    result = []
    top_10_symbols = []

    # for each top 10
    try:
        top_10 = _get_top_10()
        for c in top_10:
            symbol = c['CoinInfo']['Name']
            name = c['CoinInfo']['FullName']

            # get hourly price data
            historical_prices_get = requests.get(historical_url, {
                'fsym': symbol,
                'tsym': 'USD',
                'limit': datetime.now().hour
            })

            # get today summary for symbol
            summary_row = next((i for i in today_summary if i['key'] == symbol))
            sentiment_today = summary_row['value']

            result.append({
                'symbol': symbol,
                'name': name,
                'sentimentToday': sentiment_today,
                'priceHistorical': historical_prices_get.json()['Data']
            })
            top_10_symbols.append(symbol)

        current_prices_get = requests.get(current_url, {
            'fsyms': ','.join(top_10_symbols), 
            'tsyms': 'USD'
        })

        current_prices_data = current_prices_get.json()['RAW']

        for c in result:
            c['priceCurrent'] = current_prices_data[c['symbol']]['USD']

        return jsonify(result)

    except:
        return abort(500)
        
# ----------------------------------------------------------------------------
# Helper functions
# ----------------------------------------------------------------------------

def _get_top_10():
    url = 'https://min-api.cryptocompare.com/data/top/totalvol'
    params = {'limit': 10, 'tsym': 'USD'}
    r = requests.get(url, params)
    return r.json()['Data']

def _get_today_summary():
    req_url = 'https://' + db_creds['host'] + '/sentiments/_design/summary/_view/summary-view'
    req_params = { 'reduce': True, 'group': True }
    req_auth = (db_creds['key'], db_creds['password'])
    r = requests.get(req_url, params=req_params, auth=req_auth)
    return r.json()['rows']

# ----------------------------------------------------------------------------

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=port, debug=True)
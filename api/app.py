from flask import Flask, jsonify, abort
from flask_caching import Cache
from flask_cors import CORS
import requests
import json
import sys
import os
import time

from datetime import datetime, date, timedelta

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

@app.route('/getdata')
@cache.cached(timeout=300)
def get_data():
    """
    Returns sentiments and price data for top ten coins.
    """
    current_url = 'https://min-api.cryptocompare.com/data/pricemultifull'

    historical_url = 'https://min-api.cryptocompare.com/data/histoday'

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

            historical_prices_get = requests.get(historical_url, {
                'fsym': symbol,
                'tsym': 'USD',
                'limit': 30 # 30 days
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

        # get historical sentiments
        past_month_stamp = time.mktime((date.today() - timedelta(days=31)).timetuple())
        historical_summaries = _get_historical_summaries(past_month_stamp, top_10_symbols)

        current_prices_get = requests.get(current_url, {
            'fsyms': ','.join(top_10_symbols), 
            'tsyms': 'USD'
        })

        # get current prices
        current_prices_data = current_prices_get.json()['RAW']

        for c in result:
            c['priceCurrent'] = current_prices_data[c['symbol']]['USD']
            c['sentimentHistorical'] = historical_summaries[c['symbol']]

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

def _get_historical_summaries(limit, syms):
    req_url = 'https://' + db_creds['host'] + '/summaries/_design/timeseries/_view/means'
    req_params = { 'reduce': True, 'group': True }
    req_auth = (db_creds['key'], db_creds['password'])
    r = requests.get(req_url, params=req_params, auth=req_auth)
    unfiltered = r.json()['rows']

    # subtract 5 hr in seconds here from timestamp
    return { i['key']: { pt['date'] - 18000: pt['mean'] for pt in i['value'] } for i in unfiltered if i['key'] in syms }

# ----------------------------------------------------------------------------

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=port, debug=True)
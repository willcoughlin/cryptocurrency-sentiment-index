from flask import Flask, jsonify, abort
from flask_caching import Cache
import requests
from datetime import datetime

app = Flask(__name__)

cache = Cache(app,config={'CACHE_TYPE': 'simple'})  

@app.route('/today')
@cache.cached(timeout=300)
def today():
    """
    Returns sentiments and price data for top ten coins.
    """
    current_url = 'https://min-api.cryptocompare.com/data/pricemultifull'
    historical_url = 'https://min-api.cryptocompare.com/data/histohour'

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

            result.append({
                'symbol': symbol,
                'name': name,
                'historical': historical_prices_get.json()['Data']
            })
            top_10_symbols.append(symbol)

        current_prices_get = requests.get(current_url, {
            'fsyms': ','.join(top_10_symbols), 
            'tsyms': 'USD'
        })

        current_prices_data = current_prices_get.json()['RAW']

        for c in result:
            c['current'] = current_prices_data[c['symbol']]['USD']

        return jsonify(result)

    except:
        return abort(500)
        
# helper functions

def _get_top_10():
    url = 'https://min-api.cryptocompare.com/data/top/totalvol'
    params = {'limit': 10, 'tsym': 'USD'}
    
    r = requests.get(url, params)

    return r.json()['Data']
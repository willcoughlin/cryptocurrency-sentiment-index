from flask import Flask, jsonify, abort
import requests

app = Flask(__name__)

@app.route('/today')
def today():
    """
    Returns sentiments and price data for top ten coins.
    """

    top_10 = _get_top_10()

    prices_url = 'https://min-api.cryptocompare.com/data/pricemultifull'
    prices_params = {
        'fsyms': ','.join([c[0] for c in top_10]), 
        'tsyms': 'USD'
    }
    
    try:
        prices = requests.get(prices_url, prices_params)
    except:
        abort(500)

    price_data = prices.json()['RAW']

    result = []
    for i in top_10:
        symbol = i[0]
        currency_data = {
            'symbol': symbol,
            'name': i[1],
            'price': price_data[symbol]
        }
        result.append(currency_data)

    return jsonify(result)

# helper functions

def _get_top_10():
    url = 'https://min-api.cryptocompare.com/data/top/totalvol'
    params = {'limit': 10, 'tsym': 'USD'}
    try:
        r = requests.get(url, params)
    except:
        print()
        return abort(500)
    
    return [(c['CoinInfo']['Name'], c['CoinInfo']['FullName']) for c in r.json()['Data']]
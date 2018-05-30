import sys
import csv
import requests
import logging

from config import top_20_save_file

def get_top_20():
    # Get symbol listing
    logging.info('Getting market data...')
    url = 'https://min-api.cryptocompare.com/data/top/totalvol'
    params = {'limit': 20, 'tsym': 'USD'}
    try:
        r = requests.get(url, params)
        logging.info('Finished getting market data.')
    except Exception as err:
        logging.exception('Failed to get market data.') 
        sys.exit(err)

    currencies = [(c['CoinInfo']['Name'], c['CoinInfo']['FullName']) for c in r.json()['Data']]

    # Write to file
    logging.info('Saving to file %s...', top_20_save_file)
    with open(top_20_save_file, 'w', newline='') as f:
        fwriter = csv.writer(f)
        for c in currencies:
            fwriter.writerow(c)
    logging.info('Finished saving file.')

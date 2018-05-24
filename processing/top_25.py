""" Gets the top 25 ticker symbols by market cap. """

import coinmarketcap
import csv
import logging

from config import top25_save_file, configure_logging

# We want to get more than ten at a time so that if the rankings change and
# a new coin enters the top ten, there will be some historical data for it.
TICKER_LIM = 25

# Define log output file
LOG_FILE = 'top_25.log'

configure_logging(LOG_FILE)

# Get symbol listing
logging.info('Getting market data...')
mkt = coinmarketcap.Market()
res = mkt.ticker(start=0, limit=TICKER_LIM)
mkt_data = res['data']
logging.info('DONE.')

# # Write to file
# # NOTE: API orders by ID, so file will not be in rank-order
logging.info('Saving to file %s...', top25_save_file)
with open(top25_save_file, 'w', newline='') as f:
    fwriter = csv.writer(f)
    for id in mkt_data:
        symb = mkt_data[id]['symbol']
        name = mkt_data[id]['name']
        fwriter.writerow([symb, name])
logging.info('DONE.')

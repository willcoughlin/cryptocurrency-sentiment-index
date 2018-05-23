""" Gets the top 25 ticker symbols by market cap. """

import coinmarketcap
import csv

SAVE_FILE = 'top_25.csv'

# We want to get more than ten at a time so that if the rankings change and
# a new coin enters the top ten, there will be some historical data for it.
TICKER_LIM = 25

# Get symbol listing
mkt = coinmarketcap.Market()
res = mkt.ticker(start=0, limit=TICKER_LIM)
mkt_data = res['data']

# # Write to file
# # NOTE: API orders by ID, so file will not be in rank-order
with open(SAVE_FILE, 'w', newline='') as f:
    fwriter = csv.writer(f)
    for id in mkt_data:
        symb = mkt_data[id]['symbol']
        name = mkt_data[id]['name']
        fwriter.writerow([symb, name])
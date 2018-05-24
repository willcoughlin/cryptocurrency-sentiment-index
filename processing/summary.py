""" Get summary statistics from a view in the sentiments db. """

import cloudant
import json
import logging
import time
import math
from cloudant.design_document import DesignDocument, View
from cloudant.query import Query
from datetime import date

import config

# Define log output file
LOG_FILE = 'summary.log'

config.configure_logging(LOG_FILE)

# Connect to server
with open(config.cloudant_credentials_File, 'r') as f:
    creds = json.load(f)
    conn = cloudant.Cloudant(
        creds['username'],
        creds['password'],
        url='https://' + creds['host'],
        connect=True
    )
db = conn['sentiments']

# query view
ddoc = DesignDocument(db, '_design/statsDesignDoc')
ddoc.fetch()
view = ddoc.get_view('summary-view')
view_results = view(group=True)['rows']

# switch to summaries db
db = conn['summaries']

total = 0
for view_result in view_results:
    symbol = view_result['key']
    unix_date = int(time.mktime(date.today().timetuple()))

    # query for existing summary record
    query = Query(
        db, 
        fields=['_id', 'symbol', 'summary'],
        selector={ 'symbol': { '$eq': symbol }}
    )
    if query.result[0]:
        # Updating an existing summary

        record = db[query.result[0][0]['_id']]
        summary = record['summary']
        
        # check that summary is new
        if record['date'] == unix_date:
            logging.info('Record for %s is current - SKIPPING.', symbol)
        else:
            logging.info('Updating summary for %s', symbol)

            today_summary = view_result['value']

            # update sample size
            summary['sampleSize'] += today_summary['sampleSize']

            # add sums
            summary['sum'] += today_summary['sum']
            summary['sumSq'] += today_summary['sumSq']

            # update min/max if needed
            if today_summary['min'] < summary['min']:
                summary['min'] = today_summary['min']
            if today_summary['max'] > summary['max']:
                summary['max'] = today_summary['max']

            # update mean
            summary['mean'] = summary['sum'] / summary['sampleSize']

            # update variance
            sst = summary['sumSq'] - summary['sum']**2 / summary['sampleSize']
            variance = sst / (summary['sampleSize'] - 1)
            summary['stdDev'] = math.sqrt(variance)

            # save changes
            summary.save()
            logging.info('SUCCESS.')
    else:
        # Creating a new summary
        logging.info('Creating summary for %s...', symbol)
        data = {
            'date': unix_date,
            'symbol': symbol,
            'summary': view_result['value']
        }
        new_summary = db.create_document(data)
        if new_summary.exists():
            logging.info('SUCCESS.')
        else:
            logging.error('FAILED.')

    # don't exceed rate limit
    time.sleep(1)
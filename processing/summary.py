import cloudant
import json
import logging
import time
import math
from cloudant.design_document import DesignDocument, View
from cloudant.query import Query
from datetime import date

def create_summaries(conn):
    """
    Get summary statistics from a view in the sentiments db and update the
    summaries db.
    """

    # query view
    logging.info('Querying database for summary...')

    db = conn['sentiments']
    ddoc = DesignDocument(db, '_design/summary')
    ddoc.fetch()
    view = ddoc.get_view('summary-view')
    view_results = view(group=True)['rows']
    logging.info('Query completed.')

    # switch to summaries db
    db = conn['summaries']

    for view_result in view_results:
        symbol = view_result['key']
        unix_date = int(time.mktime(date.today().timetuple()))

        # query for today's summary record
        query = Query(
            db, 
            fields=['_id', 'symbol', 'date', 'summary'],
            selector={
                'symbol': { '$eq': symbol },
                'date': { '$eq': unix_date }
            }
        )
        if query.result[0]:
            # A record for today already exists so overwrite it. This should not normally happen.
            record = db[query.result[0][0]['_id']]
            summary = record['summary']

            logging.info('Updating summary for %s', symbol)
            record['summary'] = view_result['value']
            summary.save()
        else:
            # Creating a new summary
            logging.info('Creating summary for %s...', symbol)
            data = {
                'symbol': symbol,
                'date': unix_date,
                'summary': view_result['value']
            }
            new_summary = db.create_document(data)
            if new_summary.exists():
                logging.info('Finished creating summary.')
            else:
                logging.error('Failed to create summary.')

        # don't exceed rate limit
        time.sleep(1)

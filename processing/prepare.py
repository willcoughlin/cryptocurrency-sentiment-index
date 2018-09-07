import cloudant
import json
import logging
import sys

from cloudant.design_document import DesignDocument

import config
import top_20
import summary

def check_db(conn, name):
    """ Checks whether a database with a given name exists """

    logging.info('Checking existence of database "%s"...', name)
    if name in conn.all_dbs():
        logging.info('Database exists.')
        return True
    
    return False

def create_db_sentiments(conn):
    """ Make "sentiments" database """

    logging.info('Creating database "sentiments"...')
    db_sentiments = conn.create_database('sentiments')
    logging.info('Done creating database.')

    # create summary view
    logging.info('Creating views in database "sentiments"...')
    summary_ddoc = DesignDocument(db_sentiments, document_id='summary')
    
    with open('db/sentiments/summary.design.json') as f:
        ddoc_spec = json.load(f)

    for view_spec in ddoc_spec['views']:
        fns = ddoc_spec['views'][view_spec]
        map_fn = fns['map']
        if 'reduce' in fns:
            reduce_fn = fns['reduce']
            summary_ddoc.add_view(view_spec, map_fn, reduce_fn)
        else:
            summary_ddoc.add_view(view_spec, map_fn)
            
        summary_ddoc.create()

    logging.info('Finished creating views.')

def create_db_summaries(conn):
    """ Makes "summaries" database """

    logging.info('Database does not exist. Creating...')
    db_summaries = conn.create_database('summaries')
    logging.info('Done creating database.')

    logging.info('Creating indexes in database "summaries"...')
    with open('db/summaries/index.design.json') as f:
        ddoc_spec = json.load(f)
    
    for index_spec in ddoc_spec['indexes']:
        # construct fields
        index_fields = []
        for field in ddoc_spec['indexes'][index_spec]['index']['fields']:
            index_fields.append({
                'name': field['name'],
                'type': field['type']
            })
        # create index
        index = db_summaries.create_query_index(
            design_document_id=ddoc_spec['_id'],
            index_name=index_spec,
            index_type='text',
            fields=index_fields
        )
        index.create()

        # TODO: create date index and timeseries view

    logging.info('Finished creating indexes.')
    
def main():
    """ Driver function """
    config.configure_logging('prepare.log')

    logging.info('Beginning preparation of databases.')

    # connect to server
    try:
        logging.info('Connecting to Cloudant server...')
        with open(config.cloudant_credentials_File, 'r') as f:
            creds = json.load(f)

        conn = cloudant.Cloudant(
            creds['username'],
            creds['password'],
            url='https://' + creds['host'],
            connect=True
        )
    except Exception:
        # connection failure
        logging.exception('Error connecting to Cloudant server.')
        sys.exit('Exiting.')

    logging.info('Finished connecting to Cloudant server.')
   
    # create summaries db if it doesnt exist
    if not check_db(conn, 'summaries'):
        create_db_summaries(conn)

    # if sentiments db exists, summarize its data, then delete
    if check_db(conn, 'sentiments'):
        summary.create_summaries(conn)
        logging.info('Deleting database "sentiments"...')
        conn.delete_database('sentiments')
        logging.info('Finished deleting database.')
    create_db_sentiments(conn)

    # Update top 20 file
    top_20.get_top_20()

    logging.info('Finished preparation of databases.')
    logging.info('Ready for sentiment records.')
    
if __name__ == '__main__':
    main()

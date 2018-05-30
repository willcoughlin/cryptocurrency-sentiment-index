""" Sets values for data file paths and provides logging config """

top_20_save_file = 'top_20.csv'
cloudant_credentials_File = 'credentials/cloudant.credentials.json'
tweepy_credentials_file = 'credentials/tweepy.credentials.json'

def configure_logging(logfile):
    import os
    import logging

    if not os.path.isdir('./logs'):
        os.mkdir('./logs')

    logging.basicConfig(      
        format='[%(asctime)s] %(message)s', 
        level=logging.INFO,
        handlers=[
            logging.FileHandler('logs/' + logfile),
            logging.StreamHandler()
        ]
    )

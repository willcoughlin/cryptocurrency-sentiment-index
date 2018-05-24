""" Sets values for data file paths and provides logging config """

top25_save_file = 'top_25.csv'
cloudant_credentials_File = 'cloudant.credentials.json'
tweepy_credentials_file = 'tweepy.credentials.json'

def configure_logging(logfile):
    import logging
    logging.basicConfig(      
        format='[%(asctime)s] %(message)s', 
        level=logging.INFO,
        handlers=[
            logging.FileHandler(logfile),
            logging.StreamHandler()
        ]
    )
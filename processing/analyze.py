""" Gets tweets about top 25 coins, analyzes, and saves analysis """

import cloudant
import csv
import logging
import re
import time
import tweepy
from datetime import datetime
import json
from tweepy import OAuthHandler
from unidecode import unidecode
from vaderSentiment.vaderSentiment import SentimentIntensityAnalyzer

import config

# Function defs

def clean_text(text):
    """ Removes @handles, URLS, and non-alphanumeric characters """
    regex = r'(@[A-Za-z0-9]+)|([^0-9A-Za-z\.$, \t])|(\w+:\/\/\S+)'
    return unidecode(' '.join(re.sub(regex, ' ', text).split()))

def is_not_retweeted(tweet):
    """ Returns true if tweet is a retweet, false otherwise """
    return (not tweet.retweeted) and ('RT @' not in tweet.text)

def search_and_analyze(api, analyzer, symb, name):
    """ Search twitter for cryptocurrency and analyze the returned tweets """

    query = '{} OR {}'.format(symb, name)
    tweets = api.search(q=query, count=100, lang='en')
    result = []
    for t in tweets:
        if is_not_retweeted(t):
            dt = int(t.created_at.timestamp())
            text = clean_text(t.text)
            sentiment = analyzer.polarity_scores(text)['compound']
            result.append((dt, symb, sentiment))
    return result

def main():
    config.configure_logging('analyze.log')
    
    # Load top 25 from file
    with open(config.top25_save_file, 'r') as f:
        freader = csv.reader(f)
        top_25 = [(row[0], row[1]) for row in freader]

    # Authorize tweepy
    with open(config.tweepy_credentials_file, 'r') as f:
        creds = json.load(f)
        auth = OAuthHandler(
            creds['consumerKey'],
            creds['consumerSecret']
        )
        auth.set_access_token(
            creds['accessToken'],
            creds['accessTokenSecret']
        )

    api = tweepy.API(auth)

    # Instantiate analyzer
    analyzer = SentimentIntensityAnalyzer()

    # Connect to database
    with open(config.cloudant_credentials_File, 'r') as f:
        creds = json.load(f)
        conn = cloudant.Cloudant(
            creds['username'],
            creds['password'],
            url='https://' + creds['host'],
            connect=True
        )

    db = conn['sentiments']

    total = 0
    for coin in top_25:
        symb = coin[0]
        name = coin[1]
        # search for and analyze tweets regarding current currency
        tweets = search_and_analyze(api, analyzer, symb, name)
        for t in tweets:
            logging.info('Adding record: %s...', str(t))
            data = {
                'datetime': t[0],
                'symbol': t[1],
                'sentiment': t[2]
            }

            # dont exceed rate limit
            if (total + 1) % 10 == 0:
                time.sleep(1)

            tweet_doc = db.create_document(data)
            dt = datetime.utcnow()
            if tweet_doc.exists():
                logging.info('SUCCESS.')
            else:
                logging.error('FAILED.')
            total += 1

    logging.info('Total records inserted: %d', total)

if __name__ == '__main__':
    main()
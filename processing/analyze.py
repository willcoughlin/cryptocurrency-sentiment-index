""" Gets tweets about top 25 coins, analyzes, and saves analysis """

import config
from config import TWEEPY_CONFIG, CLOUDANT_CONFIG
import csv
from unidecode import unidecode
import re
import tweepy
from tweepy import OAuthHandler
from datetime import datetime
from vaderSentiment.vaderSentiment import SentimentIntensityAnalyzer
import cloudant

import time

# Function defs

def clean_text(text):
    """ Removes @handles, URLS, and non-alphanumeric characters """
    regex = r'(@[A-Za-z0-9]+)|([^0-9A-Za-z\.$, \t])|(\w+:\/\/\S+)'
    return unidecode(' '.join(re.sub(regex, ' ', text).split()))

def is_not_retweeted(tweet):
    """ Returns true if tweet is a retweet, false otherwise """
    return (not tweet.retweeted) and ('RT @' not in tweet.text)

def search_and_analyze(api, analyzer, symb, name):
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


# Load top 25 from file
with open('top_25.csv', 'r') as f:
    freader = csv.reader(f)
    top_25 = [(row[0], row[1]) for row in freader]

# Authorize tweepy
auth = OAuthHandler(
    TWEEPY_CONFIG['CONSUMER_KEY'],
    TWEEPY_CONFIG['CONSUMER_SECRET']
)
auth.set_access_token(
    TWEEPY_CONFIG['ACCESS_TOKEN'],
    TWEEPY_CONFIG['ACCESS_TOKEN_SECRET']
)
api = tweepy.API(auth)

# Instantiate analyzer
analyzer = SentimentIntensityAnalyzer()

# Connect to database
conn = cloudant.Cloudant(
    CLOUDANT_CONFIG['USER'],
    CLOUDANT_CONFIG['PASS'],
    url=CLOUDANT_CONFIG['HOST'],
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
        dt = datetime.utcnow()
        print('[{}] Adding record: {}... '.format(str(dt), str(t)))
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
            print('[{}] SUCCESS'.format(str(dt)))
            total += 1
        else:
            print('[{}] FAIL'.format(str(dt)))

dt = datetime.utcnow()
print('[{}] Total records inserted: {}'.format(str(dt), str(total)))

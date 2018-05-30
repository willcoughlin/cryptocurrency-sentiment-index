## Overview
These scripts perform the real data collection and processing. Here are some bullet points going over the important details:

* A ranking of the top 25 cryptocurrencies by market cap is retrieved with [coinmarketcap](https://github.com/barnumbirr/coinmarketcap).
* Tweets about cryptocurrencies are fetched from Twitter with [tweepy](http://www.tweepy.org/).
* The sentiments of the tweets are computed by the [vaderSentiment](https://github.com/cjhutto/vaderSentiment) library.
* Sentiments and summary statistics about a cryptocurrency sentiments are stored on a Cloudant server, accessed with the [cloudant](https://github.com/cloudant/python-cloudant) library.

## Tasks
Scheduling is done with `crontab` using these configurations:

    55 23 * * * cd <path_to_project> && <path_to_python3> prepare.py
    */30 * * * * cd <path_to_project> && <path_to_python3> analyze.py

    

### Prepare
Frequency: *Daily @ 11:55 PM*
#### Subtasks
1. Check for the existence of the "summaries" database.

    a. If it does not exist, create it.
    
2. Check for the existence of the "sentiments" database.

    a. If it *does* exist, call upon a summary view in the database to get stats about the sentiment records.
    
    b. Add or update the currency's record in the "summaries" database.
    
3. Using the `coinmarketcap` package, get a listing of the top 25 cryptocurrencies by market cap.

4. Save this list to a file.

### Analyze
Frequency: *Every 30 minutes*
#### Subtasks
1. Read top_25.csv to get list of currencies for querying Twitter.

2. For each currency:
    
    a. Get a list of recent Tweet texts regarding the cryptocurrency.
    
    b. Use vaderSentiment to get a sentiment score for the each text.
    
    c. Insert records of each sentiment score with a ticker symbol for the currency and a timestamp.

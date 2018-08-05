This is the web backend, which organizes price and sentiment data to be used by the application. 
Utilized in this project are:
* [Flask](http://flask.pocoo.org/) - for building the web API.
* [flask-caching](https://github.com/sh4nks/flask-caching) - to cache crypto data requests.
* [CryproCompare API](https://min-api.cryptocompare.com/) - for price data.
* [Cloudant API](https://console.bluemix.net/docs/services/Cloudant/api/index.html#api-reference-overview) - to query our database for sentiment data.

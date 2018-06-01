import React from 'react';
import '../styles/CryptoCard.css';
import LoadingIndicator from './LoadingIndicator';
import Ipsum from './Ipsum';

class CryptoCard extends React.Component {
  constructor(props) {
    super(props);
  }

  render () {
    // const data = this.props.marketData;
    const data = this.props.cryptoData;
    // const mktSummary = [
    //   { key: 'Price', val: data.quotes.USD.price },
    //   { key: '24h Chg', val: data.quotes.USD.percent_change_24h },
    //   { key: '24h Vol', val: data.quotes.USD.volume_24h },
    //   { key: 'Mkt Cap', val: data.quotes.USD.market_cap }
    // ];
    const mktSummary = [
      { key: 'Price', val: data.priceCurrent.PRICE },
      { key: '24h Chg', val: data.priceCurrent.CHANGEPCT24HOUR },
      { key: '24h Vol', val: data.priceCurrent.VOLUME24HOURTO },
      { key: 'Mkt Cap', val: data.priceCurrent.MKTCAP }
    ];
    return (
      <div className="card bg-dark text-light border-light crypto-card" id={data.symbol}>
        {/* <CryptoCardHeader coinId={data.id} name={data.name} symbol={data.symbol} mktSummary={mktSummary} /> */}
        <div className="card-header text-center border-light">
           <h2>{data.name} ({data.symbol})</h2>
        </div>
        <div className="card-body">
          {/* <Ipsum /> */}
          <div className="row">
            <div className="col-md-6">
              <CryptoCardSentimentPanel sentimentData={data.sentimentToday} />
            </div>
            <div className="col-md-6">
              {/* TODO: rename priceCurrent property to priceToday */}
              <CryptoCardPricePanel priceData={data.priceCurrent} />
            </div>
          </div>
        </div>
      </div>
    );
  }
}

class CryptoCardSentimentPanel extends React.Component {
  render() {
    const mean = this.props.sentimentData.mean.toFixed(4);
    const sentiment = mean >= 0.05 ? 'Positive': mean <= -0.05 ? 'Negative' : 'Neutral'; 
    const stdDev = this.props.sentimentData.stdDev.toFixed(4);
    const sampleSize = this.props.sentimentData.sampleSize;
    // TODO: get change pct for the day
    const changePct = null;

    return (
      <div className="card bg-dark border-dark">
        <div className="card-header bg-dark border-light">
          <h3>Today's Sentiment</h3>
        </div>
        <div className="card-body">
        {/* Classification */}
        <div className="row h5">
            <div className="col-md-6">
              Average Sentiment:
            </div>
            <div className="col-md-6">
              <span className={
                mean >= 0.05 ? 'text-success' : mean <= -0.05 ? 'text-danger' : 'text-muted' 
              }>
                {sentiment} ({mean})
              </span>
            </div>
          </div>

          {/* Pct change today */}
          <div className="row text-muted">
            <div className="col-md-6">
              Change:
            </div>
            <div className="col-md-6">
            <span className={
                changePct > 0 ? 'text-success' 
                : changePct < 0 ? 'text-danger' 
                : 'text-muted' 
              }>
                {changePct || '-'}%
              </span>
            </div>
          </div>

          {/* Stddev */}
          <div className="row text-muted">
            <div className="col-md-6">
              Standard Deviation:
            </div>
            <div className="col-md-6">
              <span>
                {stdDev}
              </span>
            </div>
          </div>

          {/* Sample size */}
          <div className="row text-muted">
            <div className="col-md-6">
              Sample Size:
            </div>
            <div className="col-md-6">
              <span>
                {sampleSize} tweets
              </span>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

class CryptoCardPricePanel extends React.Component {
  render() {
    const changePct = this.props.priceData.CHANGEPCTDAY.toFixed(4);
    const price = this.props.priceData.PRICE;
    const volume = this.props.priceData.VOLUMEDAYTO;
    const mktCap = this.props.priceData.MKTCAP;

    return (
      <div className="card bg-dark border-dark">
        <div className="card-header border-light bg-dark">
          <h3>Today's Price</h3>
        </div>
        <div className="card-body">
          {/* Current price */}
          <div className="row h5">
            <div className="col-md-6">
              Current Price:
            </div>
            <div className="col-md-6">
              <span>
                ${price.toLocaleString()}
              </span>
            </div>
          </div>

          {/* Pct change today */}
          <div className="row text-muted">
            <div className="col-md-6">
              Change:
            </div>
            <div className="col-md-6">
            <span className={
                changePct > 0 ? 'text-success' 
                : changePct < 0 ? 'text-danger' 
                : 'text-muted' 
              }>
                {changePct}%
              </span>
            </div>
          </div>
          
          {/* Mkt cap */}
          <div className="row text-muted">
            <div className="col-md-6">
              Market cap:
            </div>
            <div className="col-md-6">
              <span>
                ${mktCap.toLocaleString()}
              </span>
            </div>
          </div>

          {/* Volume today */}
          <div className="row text-muted">
            <div className="col-md-6">
              Trade volume:
            </div>
            <div className="col-md-6">
              <span>
                {volume.toLocaleString()}
              </span>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default CryptoCard;

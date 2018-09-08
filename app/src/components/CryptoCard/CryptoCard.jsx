import React from 'react';
import moment from 'moment';

import './CryptoCard.css';
import CryptoCardSentimentPanel from './SentimentPanel'
import CryptoCardPricePanel from './PricePanel'
import SPChart from '../Chart/SPChart';

class CryptoCard extends React.Component {
  constructor(props) {
    super(props);

    const mapPriceData = item => ({
      x: item.time * 1000,
      y: item.close
    })
    const mapSentimentData = item => ({
      x: item * 1000,
      y: this.props.cryptoData.sentimentHistorical[item]
    });

    const priceData = this.props.cryptoData.priceHistorical.map(mapPriceData);

    let sentimentDataKeys = Object.keys(this.props.cryptoData.sentimentHistorical);
    sentimentDataKeys = sentimentDataKeys.slice(sentimentDataKeys.length - 30);
    const sentimentData = sentimentDataKeys.map(mapSentimentData);
    sentimentData.push({
      x: priceData[priceData.length - 1].x,
      y: this.props.cryptoData.sentimentToday.mean
    });

    this.state = {
      chartDisplay: 'month',
      priceData: priceData,
      sentimentData: sentimentData
    };
  }

  render () {
    const data = this.props.cryptoData;
    const mktSummary = [
      { key: 'Price', val: data.priceCurrent.PRICE },
      { key: '24h Chg', val: data.priceCurrent.CHANGEPCT24HOUR },
      { key: '24h Vol', val: data.priceCurrent.VOLUME24HOURTO },
      { key: 'Mkt Cap', val: data.priceCurrent.MKTCAP }
    ];

    const sentimentCardData = data.sentimentToday;
    const sentimentDataKeys = Array.sort(Object.keys(this.state.sentimentData));
    const yesterdayKey = sentimentDataKeys[sentimentDataKeys.length - 2];
    sentimentCardData.yesterday = this.state.sentimentData[yesterdayKey].y;

    return (
      <div className="card bg-dark text-light border-light crypto-card" id={data.symbol}>
        <div className="card-header text-center border-light">
           <h2>{data.name} ({data.symbol})</h2>
        </div>
        <div className="card-body">

          {/* Top panels */}
          <div className="row">
            <div className="col-md-6">
              <CryptoCardSentimentPanel sentimentData={data.sentimentToday} />
            </div>
            <div className="col-md-6">
              <CryptoCardPricePanel priceData={data.priceCurrent} />
            </div>
          </div>

          {/* Chart */}
          <div className="row schart-row">
            <div className="col-md-12 chart-container border-top border-light">
              <SPChart symbol={data.symbol}
                priceData={this.state.priceData}
                sentimentData={this.state.sentimentData} />
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default CryptoCard;

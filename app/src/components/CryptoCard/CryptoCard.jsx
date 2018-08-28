import React from 'react';
import moment from 'moment';

import './CryptoCard.css';
import LoadingIndicator from '../LoadingIndicator/LoadingIndicator';
import CryptoCardSentimentPanel from './SentimentPanel'
import CryptoCardPricePanel from './PricePanel'
//import CandlestickChart from '../Chart/CandleStick'
import SPChart from '../Chart/SPChart';

class CryptoCard extends React.Component {
  constructor(props) {
    super(props);

    const mapCandlestickData = item => ({
      date: new Date(item.time * 1000),
      high: item.high,
      low: item.low,
      open: item.open,
      close: item.close,
      volume: item.volumeto
    });

    const mapPriceData = item => ({
      //x: new Date(item.time * 1000),
      x: item.time * 1000,
      y: item.close
    })

    const candlestickData = this.props.cryptoData.priceHistorical.map(mapCandlestickData);
    const priceData = this.props.cryptoData.priceHistorical.map(mapPriceData); 

    this.state = {
      chartDisplay: 'month',
      candlestickData: candlestickData,
      priceData: priceData
    }
  }

  render () {
    const data = this.props.cryptoData;
    const mktSummary = [
      { key: 'Price', val: data.priceCurrent.PRICE },
      { key: '24h Chg', val: data.priceCurrent.CHANGEPCT24HOUR },
      { key: '24h Vol', val: data.priceCurrent.VOLUME24HOURTO },
      { key: 'Mkt Cap', val: data.priceCurrent.MKTCAP }
    ];

    //console.log(this.state.candlestickData);

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
              {/* TODO: rename priceCurrent property to priceToday */}
              <CryptoCardPricePanel priceData={data.priceCurrent} />
            </div>
          </div>

          {/* Chart */}
          <div className="row schart-row">
            <div className="col-md-12 chart-container border-top border-light">
              {/* <CandlestickChart 
                symbol={data.symbol} 
                candlestickData={this.state.candlestickData}/> */}
              
              <SPChart symbol={data.symbol} 
                priceData={this.state.priceData} 
                sentimentData={[4,5,6]} /> 

            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default CryptoCard;

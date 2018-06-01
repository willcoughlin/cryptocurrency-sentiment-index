import React from 'react';
import './CryptoCard.css';
import CryptoCardSentimentPanel from './SentimentPanel'
import CryptoCardPricePanel from './PricePanel'
import LoadingIndicator from '../LoadingIndicator/LoadingIndicator';

class CryptoCard extends React.Component {
  constructor(props) {
    super(props);
  }

  render () {
    const data = this.props.cryptoData;
    const mktSummary = [
      { key: 'Price', val: data.priceCurrent.PRICE },
      { key: '24h Chg', val: data.priceCurrent.CHANGEPCT24HOUR },
      { key: '24h Vol', val: data.priceCurrent.VOLUME24HOURTO },
      { key: 'Mkt Cap', val: data.priceCurrent.MKTCAP }
    ];
    return (
      <div className="card bg-dark text-light border-light crypto-card" id={data.symbol}>
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

export default CryptoCard;

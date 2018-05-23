import React from 'react';
import '../styles/CryptoCard.css';
import LoadingIndicator from './LoadingIndicator';
import Ipsum from './Ipsum';

class CryptoCard extends React.Component {
  constructor(props) {
    super(props);
  }

  render () {
    const data = this.props.marketData;
    const mktSummary = [
      { key: 'Price', val: data.quotes.USD.price },
      { key: '24h Chg', val: data.quotes.USD.percent_change_24h },
      { key: '24h Vol', val: data.quotes.USD.volume_24h },
      { key: 'Mkt Cap', val: data.quotes.USD.market_cap }
    ];
    return (
      <div className="card crypto-card" id={data.symbol}>
        <CryptoCardHeader coinId={data.id} name={data.name} symbol={data.symbol} mktSummary={mktSummary} />
        <div className="card-body">
          <Ipsum />
        </div>
      </div>
    );
  }
}

class CryptoCardHeader extends React.Component {
  render() {
    const headerColLeft = 'col-md-9';
    const headerColRight = 'col-md-3';
    const mktSummaryColLeft = 'col-lg-6';
    const mktSummaryColRight = 'col-lg-6';

    const cmcIconUrlPrefix = 'https://s2.coinmarketcap.com/static/img/coins/64x64/';

    return (
      <div className="card-header">
        <div className="row">
          <div className={headerColLeft + ' text-center text-md-left'}>
            <div className="d-inline-block">
              <img className="mx-auto d-block" src={cmcIconUrlPrefix + this.props.coinId + '.png'} alt={this.props.symbol}/>
              <h4 className="mb-0 d-inline">{this.props.name}</h4>&nbsp;
              <span className="text-muted d-inline">({this.props.symbol})</span>
            </div>
          </div>
          <div className={headerColRight + ' text-center text-md-right'}>
            {this.props.mktSummary.map((row, i) => {
              return (
                <div key={'summ-' + this.props.symbol + '-' + i} className={'row' + (!i ? ' font-weight-bold' : '')}>
                  <div className={mktSummaryColLeft}>{row.key}:</div>
                  {/* if price change row, success for positive change, danger for negative, muted for no change */}
                  <div className={
                    mktSummaryColRight + (i === 1 
                      ? (row.val > 0 ? ' text-success' : row.val < 0 ? ' text-danger' : ' text-muted')
                      : (i > 1 ? ' text-muted' : '')
                    )
                  }>
                  {i === 1 ? row.val + '%' : '$' + row.val.toLocaleString()}
                  </div>                  
                </div>
              );
            })}
          </div>
        </div>
      </div>
    );
  }
}

export default CryptoCard;

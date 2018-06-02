import React from 'react';
import './CryptoCard.css';

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

  export default CryptoCardPricePanel
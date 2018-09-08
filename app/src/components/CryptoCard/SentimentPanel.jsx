import React from 'react';
import './CryptoCard.css';

class CryptoCardSentimentPanel extends React.Component {
    render() {
      const mean = this.props.sentimentData.mean.toFixed(4);
      const sentiment = mean >= 0.05 ? 'Positive': mean <= -0.05 ? 'Negative' : 'Neutral'; 
      const stdDev = this.props.sentimentData.stdDev.toFixed(4);
      const sampleSize = this.props.sentimentData.sampleSize;

      const today = this.props.sentimentData.mean;
      const yesterday = this.props.sentimentData.yesterday;
      const changePct = ((today - yesterday) / yesterday * 100).toFixed(4);  
  
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
                  {changePct}%
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

  export default CryptoCardSentimentPanel
import React from 'react';

import '../styles/App.css';

import NavBar from './NavBar';
import CryptoCard from './CryptoCard';
import LoadingIndicator from './LoadingIndicator';

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      tickers: null,
      marketData: null
    }
  }

  componentDidMount() {
    const url = 'https://api.coinmarketcap.com/v2/ticker/?limit=10';
    fetch(url)
      .then(response => response.json())
      .then(json => {
        const tickers = [null, null, null, null, null, null, null, null, null, null];
        const marketData = {};
        for (let i in json.data) {
          let cryptoData = json.data[i];
          tickers[cryptoData.rank - 1] = cryptoData.symbol;
          marketData[cryptoData.symbol] = cryptoData;
        }
        this.setState({tickers: tickers, marketData: marketData});
      });
  }

  render() {
    if (!this.state.tickers) {
      return <LoadingIndicator />
    } else {
      return (
        <div>
          <NavBar tickers={this.state.tickers} />
          <div id="card-list">
            <h1 className="text-center mb-4">Top Ten Coins by Market Cap</h1>
            {this.state.tickers.map(t => <CryptoCard key={'card-' + t} marketData={this.state.marketData[t]} />)}
          </div>
        </div>
      );
    }
  }
}

export default App;
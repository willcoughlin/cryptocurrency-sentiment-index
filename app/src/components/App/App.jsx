import React from 'react';

import './App.css';

import NavBar from '../NavBar/NavBar';
import CryptoCard from '../CryptoCard/CryptoCard';
import LoadingIndicator from '../LoadingIndicator/LoadingIndicator';

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      hasError: false,
      error : null,
      tickers: null,
      //marketData: null
      cryptoData: null
    }
  }

  componentDidMount() {
    //const url = 'https://ccsi-api.mybluemix.net/getdata';
    const url = 'http://localhost:8000/getdata';
    fetch(url)
      .then(response => {
        if (!response.ok) {
          this.setState({
            hasError: true, 
            error: { status: response.status, statusText: response.statusText }
          });
          throw new Error();
          return;
        } else {
          return response.json();
        }
      })
      .then(json => {
        const tickers = []
        const cryptoData = {}
        for (let i of json) {
          tickers.push(i.symbol);
          cryptoData[i.symbol] = i
        }
        this.setState({tickers: tickers, cryptoData: cryptoData});
      });
  }

  render() {
    if (!this.state.tickers) {
      if (this.state.hasError) {
        {/* TODO: refactor this into a component */}        
        return (
          <div id="error-container">
            <h1>Uh-oh!</h1>
            <h2>Error {this.state.error.status} - {this.state.error.statusText}</h2>
          </div>
        );
      } else {
        return <LoadingIndicator />;
      }
    } else {
      return (
        <div>
          <NavBar tickers={this.state.tickers} />
          <div id="card-list">
            <h1 className="text-center mb-4 text-light">Top Ten Coins by Trading Volume</h1>
            {/* {this.state.tickers.map(t => <CryptoCard key={'card-' + t} marketData={this.state.marketData[t]} />)} */}
            {this.state.tickers.map(t => <CryptoCard key={'card-' + t} cryptoData={this.state.cryptoData[t]} />)}
            
          </div>
        </div>
      );
    }
  }
}

export default App;
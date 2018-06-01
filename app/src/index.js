import React from 'react';
import ReactDOM from 'react-dom';
import '../lib/css/bootstrap.min.css';
import App from './components/App/App'

ReactDOM.render(
  <App />,
  document.getElementById('app')
);

module.hot.accept();
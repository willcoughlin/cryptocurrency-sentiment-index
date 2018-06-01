import React from 'react';
import '../styles/LoadingIndicator.css';

class LoadingIndicator extends React.Component {
    render () {
        return (
          <div className="spinner">
            <div className="rect1 bg-light"></div>
            <div className="rect2 bg-light"></div>
            <div className="rect3 bg-light"></div>
            <div className="rect4 bg-light"></div>
            <div className="rect5 bg-light"></div>
            <h1 className="text-light">Loading</h1>            
          </div>
        );
    }
}

export default LoadingIndicator;
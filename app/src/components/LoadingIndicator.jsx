import React from 'react';
import '../styles/LoadingIndicator.css';

class LoadingIndicator extends React.Component {
    render () {
        return (
          <div className="spinner">
            <div className="rect1 rounded"></div>
            <div className="rect2 rounded"></div>
            <div className="rect3 rounded"></div>
            <div className="rect4 rounded"></div>
            <div className="rect5 rounded"></div>
          </div>
        );
    }
}

export default LoadingIndicator;
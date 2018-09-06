import React from 'react';
import moment from 'moment';

import { Line } from 'react-chartjs-2';

class SPChart extends React.Component {
  render () {
    const priceDataset = {
      data: this.props.priceData,
      label: 'Price (USD)',
      borderColor: "#3e95cd",
      fill: false,
      lineTension: 0,
      yAxisID: 1
    };

    const sentimentDataset = {
      data: this.props.sentimentData,
      label: 'Sentiment (Polarity)',
      borderColor: '#cd763e',
      fill: false,
      lineTension: 0,
      yAxisID: 2
    };

    return (
      <Line 
        data={{
          labels: this.props.priceData.map(i => moment(i.x).format("MMM DD")),
          datasets: [priceDataset, sentimentDataset]
        }} 
        options={{
          legend: {
            labels: {
              fontColor: 'rgb(248, 249, 250)'
            }
          },
          scales: {
            yAxes: [{
              id: 1,
              gridLines: {
                color: '#444'
              },
              scaleLabel: {
                display: true,
                labelString: 'Price (USD)',
                fontColor: 'rgb(162, 174, 185)'
              }
            }, {
              id: 2,
              position: 'right',
              gridLines: {
                color: '#444'
              },
              scaleLabel: {
                display: true,
                labelString: 'Sentiment (Polarity)',
                fontColor: 'rgb(162, 174, 185)'
              }
            }],
            xAxes: [{
              gridLines: {
                color: '#444'
              },
              scaleLabel: {
                display: true,
                labelString: 'Date',
                fontColor: 'rgb(162, 174, 185)'
              },
              time: {
                unit: 'day'
              }
            }]
          }
        }} />
    );
  }

}

export default SPChart;
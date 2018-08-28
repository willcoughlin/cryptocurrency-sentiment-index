import React from 'react';
import moment from 'moment';

import { Line } from 'react-chartjs-2';

class SPChart extends React.Component {
  render () {
    console.log(this.props.priceData);
    // console.log(this.props.sentimentData);

    const priceDataset = {
      data: this.props.priceData,
      label: 'Price (USD)',
      borderColor: "#3e95cd",
      fill: false,
      lineTension: 0
    }
    return (
      <Line 
        data={{
          labels: this.props.priceData.map(i => moment(i.x).format("MMM DD")),
          datasets: [priceDataset]
        }} 
        options={{
          scales: {
            yAxes:[{
              scaleLabel: {
                display: true,
                labelString: 'Price (USD)'
              }
            }],
            xAxes: [{
              scaleLabel: {
                display: true,
                labelString: 'Date'
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
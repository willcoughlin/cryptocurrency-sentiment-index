import React from 'react';

import { format } from 'd3-format';
import { timeFormat } from 'd3-time-format';

import { ChartCanvas, Chart } from 'react-stockcharts';
import {
	CandlestickSeries,
} from 'react-stockcharts/lib/series';
import { XAxis, YAxis } from 'react-stockcharts/lib/axes';
import { Label } from 'react-stockcharts/lib/annotation';
import {
	CrossHairCursor,
	CurrentCoordinate,
	MouseCoordinateX,
	MouseCoordinateY,
} from 'react-stockcharts/lib/coordinates';

import { discontinuousTimeScaleProvider } from 'react-stockcharts/lib/scale';
import { OHLCTooltip } from 'react-stockcharts/lib/tooltip';
import { fitWidth } from 'react-stockcharts/lib/helper';
import { last } from 'react-stockcharts/lib/utils';

import './Chart.css'

class CandlestickChart extends React.Component {
  render() {
    const initialData = this.props.candlestickData;
    const xScaleProvider = discontinuousTimeScaleProvider.utc(d => d.date);
    const {
      data,
      xScale,
      xAccessor,
      displayXAccessor,
    } = xScaleProvider(initialData);

    const start = data[data.length - 1]
    const end = data[0];
    const xExtents = [xAccessor(start), xAccessor(end)];

    const greenOrRed = d => d.open > d.close ? "rgb(40, 167, 69)" : "rgb(220, 53, 69)";

    const candleAppearance = {
      wickStroke: "#fff",
      fill: greenOrRed,
      stroke: greenOrRed,
      candleStrokeWidth: 1,
      widthRatio: 0.5,
      opacity: 1,
    };

    const margin = { left: 80, right: 80, top: 10, bottom: 60 };
    var [yAxisLabelX, yAxisLabelY] = [width - margin.left - 40, margin.top + (height - margin.top - margin.bottom) / 2];
    const width = document.querySelector('.chart-container').clientWidth;
    const height = 500;

    return (
      <div>
        <ChartCanvas
          className="chart-svg"
          height={height}
          width={width}
          ratio={1}
          margin={margin}
          padding={{left: 100, right: 100}}
          type="svg"
          seriesName={this.props.symbol}
          data={data}
          xScale={xScale}
          xAccessor={xAccessor}
          displayXAccessor={displayXAccessor}
          xExtents={xExtents}
          panEvent={false}
          zoomEvent={false}
          clamp="both"
        >

          <Chart id={0}
            yExtents={[d => [d.high, d.low]]}
            padding={{ top: 40, bottom: 20 }}
          >
            <XAxis axisAt="bottom" orient="bottom" stroke="#fff" tickStroke="#fff" />
					  <YAxis axisAt="left" orient="left" stroke="#fff" tickStroke="#fff" />

            <Label 
              x={(width - margin.left - margin.right) / 2} 
              y={height - 20} 
              text="Date" />

            <Label x={-70} y={height / 2}
              rotate={-90}
              text="Price (USD)" /> 

            <MouseCoordinateX
              rectWidth={60}
              at="bottom"
              orient="bottom"
              displayFormat={timeFormat("%H:%M:%S")} />
            <MouseCoordinateY
              at="left"
              orient="left"
              displayFormat={format(".2f")} />

            <OHLCTooltip 
              origin={[10, 0]} xDisplayFormat={timeFormat("%Y-%m-%d %H:%M:%S")}
               />

            <CandlestickSeries clip={false} {...candleAppearance} />
          </Chart>
          
        </ChartCanvas>
      </div>
    );
  }
}

CandlestickChart = fitWidth(CandlestickChart);

export default CandlestickChart;
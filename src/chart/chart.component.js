/**
 * Created by Pencroff on 14-Dec-15.
 */
import './chart.style.less';
import d3 from 'd3';

export function chart(rootClass, dataset) {
  const data = dataset.data;
  const chartsNames = dataset.columns.slice(1);
  const priceRange = calculatePriceMinMax(data);
  const priceDelta = calculateDeltaMinMax(data);

  const margin = {top: 20, right: 20, bottom: 30, left: 40};
  const width = 960 - margin.left - margin.right;
  const height = 500 - margin.top - margin.bottom;

  const xAxisData = d3.scale.ordinal()
    .domain(data.map(function(d) { return d.period; }).reverse())
    .rangePoints([0, width]);

  const yAxisPriceData = d3.scale.linear()
    .domain([priceRange.min, priceRange.max])
    .range([height, 0]);

  const yAxisDeltaData = d3.scale.linear()
    .domain([priceDelta.min, priceDelta.max])
    .range([height, 0]);

  const colors = d3.scale.ordinal()
    .domain(chartsNames)
    .range(['#2981BB', '#89A54E', '#DB843D']);

  const lineFlats = d3.svg.line()
    .x(d => xAxisData(d.period))
    .y(d => yAxisPriceData(d.Flats));

  const lineDwellings = d3.svg.line()
    .x(d => xAxisData(d.period))
    .y(d => yAxisPriceData(d.Dwellings));

  const lineDelta = d3.svg.line()
    //.interpolate('bundle')
    .x(d => xAxisData(d.period))
    .y(d => yAxisDeltaData(d.Delta));

  const canvas = d3.select(rootClass)
    .append('div')
    .classed('data-chart', true)
    .append('svg')
    .attr('width', width + margin.left + margin.right)
    .attr('height', height + margin.top + margin.bottom)
    .append('g')
    .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');

  appendXAxis(canvas, xAxisData, height);
  appendYAxisPrice(canvas, yAxisPriceData);
  appendYAxisDelta(canvas, yAxisDeltaData, width);

  appendChart(canvas, data, lineFlats, colors(chartsNames[0]));
  appendChart(canvas, data, lineDwellings, colors(chartsNames[1]));
  appendChart(canvas, data, lineDelta, colors(chartsNames[2]));

  appendLegend(canvas, chartsNames, colors, width);
}

function appendChart(canvas, data, chartData, color) {
  canvas.append('path')
    .datum(data)
    .attr('class', 'data-chart__line')
    .attr('d', chartData)
    .style('stroke', d => color);
}

function appendXAxis(canvas, xAxisData, height) {
  const xTicksFilter = 11;

  const xAxis = d3.svg.axis()
    .scale(xAxisData)
    .tickValues(xAxisData.domain().filter((item, index) => !(index % xTicksFilter)))
    .orient('bottom');

  canvas.append('g')
    .attr('class', 'data-chart__x-axis')
    .attr('transform', 'translate(0,' + height + ')')
    .call(xAxis);
}

function appendYAxisPrice(canvas, yAxisDataPrice) {
  const yTicks = 5;
  const yAxisPrice = d3.svg.axis()
    .scale(yAxisDataPrice)
    .orient('left')
    .tickFormat(d3.format('.2s'))
    .ticks(yTicks);

  canvas.append('g')
    .attr('class', 'data-chart__y-axis')
    .call(yAxisPrice)
    .append('text')
    .attr('transform', 'rotate(-90)')
    .attr('y', 6)
    .attr('dy', '.71em')
    .style('text-anchor', 'end')
    .text('2007 year = 100%');
}

function appendYAxisDelta(canvas, yAxisDataDelta, width) {
  const yTicks = 7;
  const yAxisDelta = d3.svg.axis()
    .scale(yAxisDataDelta)
    .orient('right')
    .tickFormat(d3.format('.2s'))
    .ticks(yTicks);

  canvas.append('g')
    .attr('class', 'data-chart__y-axis')
    .attr('transform', 'translate(' + (width - 10) + ' ,0)')
    .call(yAxisDelta)
    .append('text')
    .attr('transform', 'rotate(-90)')
    .attr('y', 6)
    .attr('dy', '-1em')
    .style('text-anchor', 'end')
    .text('Delta');
}

function appendLegend(canvas, names, colors, width) {
  const legend = canvas.selectAll('.data-chart__legend')
    .data(names)
    .enter().append('g')
    .attr('class', 'data-chart__legend')
    .attr('transform', function(d, i) { return 'translate(-40,' + i * 20 + ')'; });

  legend.append('rect')
    .attr('x', width - 18)
    .attr('width', 18)
    .attr('height', 18)
    .style('fill', colors);

  legend.append('text')
    .attr('x', width - 24)
    .attr('y', 9)
    .attr('dy', '.35em')
    .style('text-anchor', 'end')
    .text(function(d) { return d; });
}

function calculatePriceMinMax(data) {
  let maxYPrice = d3.max([
    d3.max(data, item => item.Flats),
    d3.max(data, item => item.Dwellings)
  ]);
  let minYPrice = d3.min([
    d3.min(data, item => item.Flats),
    d3.min(data, item => item.Dwellings)
  ]);
  maxYPrice = maxYPrice + maxYPrice * 0.1; // Add 10% to available max value
  minYPrice = minYPrice - Math.abs(minYPrice) * 0.1;
  return {
    min: minYPrice,
    max: maxYPrice
  }
}

function calculateDeltaMinMax(data) {
  let maxYDelta = d3.max(data, item => item.Delta);
  let minYDelta = d3.min(data, item => item.Delta);
  maxYDelta = maxYDelta + maxYDelta * 0.1;
  minYDelta = minYDelta - Math.abs(minYDelta) * 0.1;
  return {
    min: minYDelta,
    max: maxYDelta
  }
}


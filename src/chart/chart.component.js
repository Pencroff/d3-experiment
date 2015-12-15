/**
 * Created by Pencroff on 14-Dec-15.
 */
import './chart.style.less';
import d3 from 'd3';

export function chart(rootClass, dataset) {
  //console.log(dataset);
  /*
   Delta: -3.04
   Dwellings: 61.23
   Flats: 58.19
   period: "2015-02-28"
   */
  const data = dataset.data;
  const columns = dataset.columns.slice(1);

  let maxY = d3.max([
    d3.max(data, item => item.Flats),
    d3.max(data, item => item.Dwellings)
  ]);
  let minY = d3.min([
    d3.min(data, item => item.Flats),
    d3.min(data, item => item.Dwellings)
  ]);
  maxY = maxY + maxY * 0.1; // Add 10% to available max value
  minY = minY - minY * 0.1;

  let maxYRight = d3.max(data, item => item.Delta);
  let minYRight = d3.min(data, item => item.Delta);
  maxYRight = maxYRight + maxYRight * 0.1;
  minYRight = minYRight - minYRight * 0.1;

  const margin = {top: 20, right: 20, bottom: 30, left: 40};
  const width = 960 - margin.left - margin.right;
  const height = 500 - margin.top - margin.bottom;

  const xTicksFilter = 11;
  const xAxisData = d3.scale.ordinal()
    .domain(data.map(function(d) { return d.period; }).reverse())
    .rangePoints([0, width]);

  const yTicks = 5;
  const yAxisData = d3.scale.linear()
    .domain([minY, maxY])
    .range([height, 0]);

  const yAxisDataRight = d3.scale.linear()
    .domain([minYRight, maxYRight])
    .range([height, 0]);

  const colors = d3.scale.ordinal()
    .domain(columns)
    .range(['#2981BB', '#89A54E', '#DB843D']);

  const xAxis = d3.svg.axis()
    .scale(xAxisData)
    .tickValues(xAxisData.domain().filter(function(d, i) { return !(i % xTicksFilter); }))
    .orient('bottom');

  const yAxis = d3.svg.axis()
    .scale(yAxisData)
    .orient('left')
    .tickFormat(d3.format('.2s'))
    .ticks(yTicks);

  const yAxisRight = d3.svg.axis()
    .scale(yAxisDataRight)
    .orient('right')
    .tickFormat(d3.format('.2s'))
    .ticks(yTicks);

  const lineFlats = d3.svg.line()
    .x(d => xAxisData(d.period))
    .y(d => yAxisData(d.Flats));

  const lineDwellings = d3.svg.line()
    .x(d => xAxisData(d.period))
    .y(d => yAxisData(d.Dwellings));

  const lineDelta = d3.svg.line()
    //.interpolate('bundle')
    .x(d => xAxisData(d.period))
    .y(d => yAxisDataRight(d.Delta));

  const svg = d3.select(rootClass)
    .append('div')
    .classed('data-chart', true)
    .append('svg')
    .attr('width', width + margin.left + margin.right)
    .attr('height', height + margin.top + margin.bottom)
    .append('g')
    .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');

  svg.append('g')
    .attr('class', 'data-chart__x-axis')
    .attr('transform', 'translate(0,' + height + ')')
    .call(xAxis);

  svg.append('g')
    .attr('class', 'data-chart__y-axis')
    .call(yAxis)
    .append('text')
    .attr('transform', 'rotate(-90)')
    .attr('y', 6)
    .attr('dy', '.71em')
    .style('text-anchor', 'end')
    .text('2007 year = 100%');

  svg.append('g')
    .attr('class', 'data-chart__y-axis')
    .attr('transform', 'translate(' + (width - 10) + ' ,0)')
    .call(yAxisRight)
    .append('text')
    .attr('transform', 'rotate(-90)')
    .attr('y', 6)
    .attr('dy', '-1em')
    .style('text-anchor', 'end')
    .text('Delta');

  svg.append('path')
    .datum(data)
    .attr('class', 'data-chart__line')
    .attr('d', lineFlats)
    .style('stroke', d => colors(columns[0]));

  svg.append('path')
    .datum(data)
    .attr('class', 'data-chart__line')
    .attr('d', lineDwellings)
    .style('stroke', d => colors(columns[1]));

  svg.append('path')
    .datum(data)
    .attr('class', 'data-chart__line')
    .attr('d', lineDelta)
    .style('stroke', d => colors(columns[2]));

  var legend = svg.selectAll('.data-chart__legend')
    .data(columns)
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

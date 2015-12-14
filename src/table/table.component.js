/**
 * Created by Pencroff on 13-Dec-15.
 */

import d3 from 'd3';
import _ from 'lodash';

import './table.style.less';

export function table(rootClass, dataset) {

  const table = d3.select(rootClass)
    .append('table');
  table.classed('data-table', true);

  table.append('thead').append('tr')
    .classed('data-table__head-row', true)
    .selectAll('th')
    .data(dataset.columns).enter()
    .append('th')
    .text(col => col.toUpperCase())
    .classed('data-table__head-cell', true);

  table.append('tbody')
    .selectAll('tr')
    .data(dataset.data).enter()
    .append('tr')
    .classed('data-table__data-row', true)
    .selectAll('td')
    .data(row =>
      _.map(dataset.columns,
        col => row[col])
    ).enter()
    .append('td')
    .classed('data-table__data-cell', true)
    .text(col => col);

  return dataset;
}

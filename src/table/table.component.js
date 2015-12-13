/**
 * Created by Pencroff on 13-Dec-15.
 */

import d3 from 'd3';
import _ from 'lodash';

export function table(rootClass, dataset) {

  const table = d3.select(rootClass).append('table');

  table.append('thead').append('tr')
    .selectAll('th')
    .data(dataset.columns).enter()
    .append('th')
    .text(col => col.toUpperCase());

  table.append('tbody')
    .selectAll('tr')
    .data(dataset.data).enter()
    .append('tr')
    .selectAll('td')
    .data(row =>
      _.map(dataset.columns,
        col => row[col])
    ).enter()
    .append('td')
    .text(col => col);

  return dataset;
}

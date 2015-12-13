/**
 * Created by Pencroff on 13-Dec-15.
 */

import Promise from 'bluebird';
import d3 from 'd3';
import _ from 'lodash';

export function dataReader(filePath) {
  return new Promise((resolve, reject) => {
    d3.json(filePath, function(err, json) {
      if (err) return reject(err);
      resolve(json.dataset);
    });
  });
}

export function dataConverter(dataSets) {
  const result = {
    data: [],
    columns: ['period']
  };
  _.forEach(dataSets, (value, key) => {
    pushDataFromDataset(result, value);
  });
  calculateDelta(result);
  return result;
}

function pushDataFromDataset(result, dataSet) {
  const arr = dataSet && dataSet.data ? dataSet.data : [];
  const setName = dataSet['short-name'];
  result.columns.push(setName);
  _.forEach(arr, item => {
    const period = item[0];
    const value = item[1];
    let obj = _.find(result.data, item => item.period === period );
    if (!obj) {
      obj = { period: period };
      result.data.push(obj);
    }
    obj[setName] = value;
  });
}

function calculateDelta(result) {
  const deltaColName = 'delta';
  const colA = result.columns[1];
  const colB = result.columns[2];
  _.forEach(result.data, item => item[deltaColName] = _.round(item[colA] - item[colB], 2));
  result.columns.push(deltaColName);
}

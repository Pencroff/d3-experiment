/**
 * Created by Pencroff on 13-Dec-15.
 */

import Promise from 'bluebird';
import d3 from 'd3';
window.d3 = d3;
import config from './app.config';
import {dataReader, dataConverter} from './data/data-broker';
import {mainTitle} from './main-title/main-title.component';
import {table} from './table/table.component';
import {chart} from './chart/chart.component';


(function app() {
  const dataSets = {
    flats: dataReader(config.flatPath),
    dwellings:dataReader(config.dwellingPath)
  };
  Promise.props(dataSets)
    .then(dataConverter)
    .then(data => table(config.tableClass, data))
    .then(data => chart(config.chartClass, data));
    //.then(data=>console.log(data));
  mainTitle();

})();

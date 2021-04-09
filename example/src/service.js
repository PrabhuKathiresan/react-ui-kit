/* eslint-disable */
import data from './olympic.json';
import { createSorter } from './utils/sort';
import { createFilter } from './utils/filter';

const stringify = str => JSON.stringify(str);

const wait = ms => new Promise(resolve => {
  setTimeout(() => {
    resolve();
  }, ms);
});

const get = ({ limit = 10, skip = 0, sort = [] , filters = [], searchText = '', paginate = false }) => new Promise(resolve => {
  wait(2000)
    .then(() => {
      let d = data.filter(_d => stringify(_d).toLowerCase().includes(searchText.toLowerCase()));
      d = createFilter(d, filters);
      let total = d.length;
      d = d.sort(createSorter(...sort))
      if (paginate) d = d.slice(skip, skip + limit);
      resolve({
        data: d,
        total
      });
    }).catch(err => {
      console.log(err);
    });
});

export default {
  get,
};
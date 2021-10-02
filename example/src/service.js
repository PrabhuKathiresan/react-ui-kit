/* eslint-disable */
import olympic from './olympic.json';
import { createSorter } from './utils/sort';
import { createFilter } from './utils/filter';

const stringify = str => JSON.stringify(str);

const wait = ms => new Promise(resolve => {
  setTimeout(() => {
    resolve();
  }, ms);
});

const get = ({ limit = 10, skip = 0, sort = [] , filters = [], searchText = '', paginate = false }) => new Promise(resolve => {
  wait(1000)
    .then(() => {
      let data = olympic.filter(_d => stringify(_d).toLowerCase().includes(searchText.toLowerCase()));
      data = createFilter(data, filters);
      let total = data.length;
      data = data.sort(createSorter(...sort))
      if (paginate) data = data.slice(skip, skip + limit);
      resolve({
        data,
        total
      });
    }).catch(err => {
      console.log(err);
    });
});

export default {
  get,
};
/* eslint-disable */
const toLowerCase = str => str.toLowerCase();

const createFilter = (data, filters) => {
  let filteredData = [...data];
  if (filters.length === 0) return filteredData;
  filters.forEach(filter => {
    let { condition, value, field, accessor, useFilter, type } = filter;
    let filterFunc;
    switch (condition) {
      case 'eq':
        filterFunc = (d, k) => d === k;
        break;
      case 'neq':
        filterFunc = (d, k) => d !== k;
        break;
      case 'contains':
        filterFunc = (d, k) => d.includes(k);
        break;
      case 'gt':
        filterFunc = (d, k) => d > k;
        break;
      case 'gte':
        filterFunc = (d, k) => d >= k;
        break;
      case 'lt':
        filterFunc = (d, k) => d < k;
        break;
      case 'lte':
        filterFunc = (d, k) => d <= k;
        break;
      case 'startsWith':
        filterFunc = (d, k) => d.startsWith(k);
        break;
      case 'endsWith':
        filterFunc = (d, k) => d.endsWith(k);
        break;
      default:
        filterFunc = (d, k) => d === k;
    }
    if (value) {
      filteredData = filteredData.filter(d => {
        let accessData = typeof accessor === 'function' ? accessor(d) : d[accessor];
        if (typeof useFilter === 'function') {
          accessData = useFilter(d);
        }
        if (type === 'string') {
          accessData = toLowerCase(accessData);
          value = toLowerCase(value);
        }
        if (type === 'date') {
          accessData = new Date(accessData);
          value = new Date(value);
        }
        return filterFunc(accessData, value);
      })
    }
  });

  return filteredData;
};

export { createFilter };
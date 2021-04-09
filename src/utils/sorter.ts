export const isUnDefined = (val: any) => typeof val === 'undefined';

const dirMap = {
  // greater-than
  gt: { asc: 1, desc: -1 },
  // less-than
  lt: { asc: -1, desc: 1 },
};

const doSort = (A: any, B: any, property: any, direction: any) => {
  direction = direction || 'ASC'
  const a = typeof property === 'function' ? property(A) : A[property];
  const b = typeof property === 'function' ? property(B) : B[property];

  if ((isUnDefined(a) && !isUnDefined(b)) || (a < b)) {
    return dirMap.lt[direction.toLowerCase()];
  }
  if ((isUnDefined(a) && isUnDefined(b)) || (a > b)) {
    return dirMap.gt[direction.toLowerCase()];
  }
  return 0;
};

const createSorter = (...args: { direction: any; property: any; }[]) => {
  if (typeof args[0] === 'string') {
    args = [
      {
        direction: args[1],
        property: args[0],
      },
    ];
  }

  return (A: any, B: any) => {
    let ret = 0;

    args.some((sorter) => {
      const { property, direction = 'ASC' } = sorter;
      const value = doSort(A, B, property, direction);

      if (value === 0) {
        // they are equal, continue to next sorter if any
        return false;
      }
      // they are different, stop at current sorter
      ret = value;

      return true;
    });

    return ret;
  };
};

export default createSorter;

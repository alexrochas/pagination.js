export default {
  'split': (list, offset) => {
    const lists = [];
    let partialList = [];
    let page = 1;
    let i = 1;

    list.forEach((value, key) => {
      partialList.push(value);

      if (! (i % offset === 0) && !(key === list.length - 1))  {
        i++;
        return ;
      }

      lists[page++] = partialList;

      if(i % offset == 0) {
        partialList = [];
        i = 0;
      }

      i++;
    });

    return lists;
  }
};

export const filterPaging = (items, numberItems, currentPage) => {
  let pageIndex = 0;
  if (currentPage > 1) {
    pageIndex = currentPage - 1;
  }

  let controlledNumberItems = 0;
  if (numberItems > 0) {
    controlledNumberItems = numberItems;
  }

  const length = items.length;
  const beginIndex = pageIndex * controlledNumberItems;
  const lastIndex =
    length < beginIndex + controlledNumberItems
      ? length
      : beginIndex + controlledNumberItems;

  return items.slice(beginIndex, lastIndex);
};

export const computeNumberPages = (items, numberItems) => {
  if (!items) {
    return 1;
  }
  const numberItemsControlled = numberItems < 1 ? 1 : numberItems;
  const length = items.length;
  return length > 0 ? Math.ceil(length / numberItemsControlled) : 1;
};


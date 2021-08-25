export const computeNumberPages = (items, numberPageItems) => {
    if (!items) {
        return 1;
    }
    const numberItemsControlled = numberPageItems < 1 ? 1 : numberPageItems;
    const {length} = items;
    return length > 0 ? Math.ceil(length / numberItemsControlled) : 1;
};

export const filterPaging = (items, numberItems, currentPage) => {
    let pageIndex = 0;
    if (currentPage > 1) {
        pageIndex = currentPage - 1;
    }

    let controlledNumberItems = 0;
    if (numberItems > 0) {
        controlledNumberItems = numberItems;
    }

    const {length} = items;
    let beginIndex = pageIndex * controlledNumberItems;
    const lastIndex = length < beginIndex + controlledNumberItems ? length : beginIndex + controlledNumberItems;

    let returnedCurrentPage = currentPage;

    if (lastIndex < beginIndex) {
        if (lastIndex - length >= 0) {
            beginIndex = lastIndex - length;
        } else {
            beginIndex = 0;
        }
        returnedCurrentPage = -1;
    }
    return {items: items.slice(beginIndex, lastIndex), currentPage: returnedCurrentPage};
};

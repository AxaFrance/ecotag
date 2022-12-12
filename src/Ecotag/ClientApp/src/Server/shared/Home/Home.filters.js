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
    const lastIndex = length < beginIndex + controlledNumberItems ? length : beginIndex + controlledNumberItems;

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

export const getItemsFiltered = (items, filterValue) => {
    if (filterValue !== null && filterValue !== undefined && filterValue.length > 0) {
        return items.filter(project => project.name.toLowerCase().includes(filterValue.toLowerCase()));
    }
    return items;
};

export const sortByTimeLastUpdate = (a, b) => {
    if (a.value.timeLastUpdate === b.value.timeLastUpdate) {
        return 0;
    }

    if (a.value.timeLastUpdate === null) {
        return 1;
    }

    if (b.value.timeLastUpdate === null) {
        return -1;
    }

    return a.value.timeLastUpdate - b.value.timeLastUpdate;
};

const computeEntries = columns => {
    const entries = [];
    for (const [key, value] of Object.entries(columns)) {
        entries.push({key, value});
    }
    return entries;
};

const compareItems = (entry, itemA, itemB) => {
    if (typeof itemB[entry.key] === 'number') {
        return itemB[entry.key] < itemA[entry.key] ? 1 : -1;
    }
    if (itemB[entry.key] && itemA[entry.key]) {
        if (itemB[entry.key] instanceof Date) {
            return itemA[entry.key].getTime() - itemB[entry.key].getTime();
        }
        const localComp = itemA[entry.key].localeCompare(itemB[entry.key]);
        if (localComp !== 0) {
            return localComp;
        }
    }
};

const compareItemsBySortingType = (columns, entry, itemA, itemB) => {
    if (columns[entry.key].value === 'asc') {
        return compareItems(entry, itemA, itemB);
    }
    if (columns[entry.key].value === 'desc') {
        return compareItems(entry, itemB, itemA);
    }
};

export const getItemsSorted = (items, columns) => {
    const entries = computeEntries(columns);
    entries.sort(sortByTimeLastUpdate);
    const criteria = entries[0];
    return [...items].sort((itemA, itemB) => compareItemsBySortingType(columns, criteria, itemA, itemB));
};

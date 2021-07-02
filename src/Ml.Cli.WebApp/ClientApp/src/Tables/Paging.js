export const computeNumberPages = (items, numberPageItems) => {
    if (!items) {
        return 1;
    }
    const numberItemsControlled = numberPageItems < 1 ? 1 : numberPageItems;
    const {length} = items;
    return length > 0 ? Math.ceil(length / numberItemsControlled) : 1;
};

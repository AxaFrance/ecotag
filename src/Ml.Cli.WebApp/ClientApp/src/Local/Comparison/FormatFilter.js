// Ne pas effacer les paramètres non utilisés, ils sont utilisés par le eval
export const formatBody = ({rawBodyInput, side, item}) => {
    let rawBodyOutput = rawBodyInput;
    let isSkipped = false;
    // eslint-disable-next-line no-eval
    eval(side);
    return {isSkipped, body: rawBodyOutput};
};

export const formatJson = state => {
    const {items, filters} = state;
    if(!filters.filterLeft && !filters.filterRight){
        return items;
    }
    try {
        const copyArray = JSON.parse(JSON.stringify(items));
        return copyArray.reduce(function(result, item){
            const newItem = item;
            const { isSkipped: isSkippedLeft, body: formatBodyLeft } = formatBody({
                item,
                rawBodyInput: item.left.Body,
                side: filters.filterLeft,
            });
            const { isSkipped: isSkippedRight, body: formatBodyRight } = formatBody({
                item,
                rawBodyInput: item.right.Body,
                side: filters.filterRight,
            });
            if (isSkippedLeft || isSkippedRight) {
                return result;
            }
            newItem.left.Body = formatBodyLeft;
            newItem.right.Body = formatBodyRight;
            result.push(newItem);
            return result;
        }, []);
    } catch (error) {
        console.log(error);
        return items;
    }
};

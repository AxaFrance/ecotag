export const generateLabelsKeyMap = (keyMapArray, labelsLength) => {
    for(let i = 1; i <= labelsLength; i++){
        if(!(`${i.toString(16)}` in keyMapArray)){
            keyMapArray[`${i.toString(16)}`] = `${i.toString(16)}`;
        }
    }
};
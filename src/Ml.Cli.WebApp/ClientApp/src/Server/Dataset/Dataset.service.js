export const fetchDataset = fetch => async id => fetch(`datasets/${id}`);

export const fetchImportedDatasets = fetch => async () => fetch(`datasets/imported`);

export const fetchCreateDataset = fetch => async newDataset =>
    fetch('datasets', {
        method: 'POST',
        body: JSON.stringify(newDataset),
    });

export const fetchLockDataset = fetch => async (id) =>
    fetch(`datasets/${id}/lock`, {
        method: 'POST',
        body: "",
    });

export const fetchDatasets = fetch => async (isLocked = null) =>{
    if(isLocked == null){
        return fetch('datasets');
    }
    return fetch('datasets?locked=' + isLocked);
};

export default fetchDatasets;

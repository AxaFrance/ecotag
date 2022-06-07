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

export const Locked = {
    None:0,
    Pending:1,
    Locked:2,
}

export const fetchDatasets = fetch => async (locked = null) =>{
    if(locked == null){
        return fetch('datasets');
    }
    return fetch(`datasets?locked=${locked.toLocaleString()}`);
};

export default fetchDatasets;

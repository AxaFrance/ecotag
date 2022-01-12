export const fetchCreateDataset = fetch => async newDataset =>
  fetch('datasets', {
    method: 'POST',
    body: JSON.stringify(newDataset),
  });


export const fetchCreateProject = fetch => async newProject =>
    fetch('projects', {
        method: 'POST',
        body: JSON.stringify(newProject),
    });

export const fetchLockDataset = fetch => async (id) =>
    fetch(`datasets/${id}/lock`, {
        method: 'POST',
        body: "",
    });

export const fetchGroups = fetch => async () => fetch('groups');

export const fetchDatasets = fetch => async (isLocked = null) =>{
    if(isLocked == null){
        return fetch('datasets');
    }
    return fetch('datasets?locked=' + isLocked);
    
} 
export const fetchDataset = fetch => async id => fetch(`datasets/${id}`);
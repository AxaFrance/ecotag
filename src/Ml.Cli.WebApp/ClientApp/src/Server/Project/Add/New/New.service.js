export const fetchCreateDataset = fetch => async newProject =>
  fetch('datasets', {
    method: 'POST',
    body: JSON.stringify(newProject),
  });

export const fetchLockDataset = fetch => async (id) =>
    fetch(`datasets/${id}/lock`, {
        method: 'POST',
        body: "",
    });

export const fetchGroups = fetch => async () => fetch('groups');

export const fetchDatasets = fetch => async () => fetch('datasets');
export const fetchDataset = fetch => async id => fetch(`datasets/${id}`);
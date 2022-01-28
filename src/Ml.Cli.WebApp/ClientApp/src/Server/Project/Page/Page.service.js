export const fetchProject = fetch => async id => fetch(`projects/${id}`);
export const fetchDataset = fetch => async id => fetch(`datasets/${id}`);
export const fetchGroup = fetch => async id => fetch(`groups/${id}`);



export const fetchReserveAnnotations = fetch => async (projectId, fileId) =>
    fetch(`projects/${projectId}/reserve`, {
        method: 'POST',
        body: JSON.stringify({fileId})
    });

export const fetchAnnotate = fetch => async (projectId, fileId, data) =>
    fetch(`projects/${projectId}/annotations/${fileId}`, {
        method: 'POST',
        body: JSON.stringify({data : JSON.stringify(data)})
    });

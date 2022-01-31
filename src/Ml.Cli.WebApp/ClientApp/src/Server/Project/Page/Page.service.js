export const fetchProject = fetch => async id => fetch(`projects/${id}`);
export const fetchDataset = fetch => async id => fetch(`datasets/${id}`);
export const fetchGroup = fetch => async id => fetch(`groups/${id}`);

export const fetchReserveAnnotations = fetch => async (projectId, fileId) =>
    fetch(`projects/${projectId}/reserve`, {
        method: 'POST',
        body: JSON.stringify({fileId})
    });

export const fetchAnnotate = fetch => async (projectId, fileId, annotationId, data) => {
    if(annotationId){
        return fetch(`projects/${projectId}/annotations/${fileId}/${annotationId}`, {
            method: 'PUT',
            body: JSON.stringify({expectedOutput : JSON.stringify(data)})
        });
    } 
    return fetch(`projects/${projectId}/annotations/${fileId}`, {
        method: 'POST',
        body: JSON.stringify({expectedOutput : JSON.stringify(data)})
    });
}
    

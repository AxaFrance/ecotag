export const fetchProject = fetch => async id => fetch(`projects/${id}`);
export const fetchProjects = fetch => async () => fetch(`projects`);

export const fetchDeleteProject = fetch => async id =>
    fetch(`projects/${id}`, {
        method: 'DELETE',
    });

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

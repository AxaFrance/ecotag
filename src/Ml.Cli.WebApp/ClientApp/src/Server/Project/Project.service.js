export const fetchProject = fetch => async id => fetch(`projects/${id}`);
export const fetchProjects = fetch => async () => fetch(`projects`);

export const fetchReserveAnnotations = fetch => async (projectId, fileId) =>
    fetch(`projects/${projectId}/reserve`, {
        method: 'POST',
        body: JSON.stringify({fileId})
    });

export const fetchAnnotate = fetch => async (projectId, fileId, annotationId, data) => {
    return fetch(`projects/${projectId}/annotations/${fileId}`, {
        method: 'POST',
        body: JSON.stringify({expectedOutput : JSON.stringify(data)})
    });
}

export const fetchDataset = fetch => async (idProject , idDataset) =>{
    return fetch(`projects/${idProject}/${idDataset}`);
}

export const fetchCreateProject = fetch => async newProject =>
    fetch('projects', {
        method: 'POST',
        body: JSON.stringify(newProject),
    });

export const fetchProject = fetch => async id => fetch(`projects/${id}`);
export const fetchDataset = fetch => async id => fetch(`datasets/${id}`);
export const fetchGroup = fetch => async id => fetch(`groups/${id}`);



export const fetchReserveAnnotations = fetch => async projectId =>
    fetch(`projects/${projectId}/reserve`, {
        method: 'POST',
        body: "{}"
    });

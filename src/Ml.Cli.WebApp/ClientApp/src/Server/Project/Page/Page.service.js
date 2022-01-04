export const fetchProject = fetch => async id => fetch(`projects/${id}`);
export const fetchDataset = fetch => async id => fetch(`datasets/${id}`);
export const fetchGroup = fetch => async id => fetch(`groups/${id}`);

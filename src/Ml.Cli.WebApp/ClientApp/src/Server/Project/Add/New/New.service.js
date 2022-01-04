export const fetchCreateProject = fetch => async newProject =>
  fetch('projects', {
    method: 'POST',
    body: JSON.stringify(newProject),
  });

export const fetchGroups = fetch => async () => fetch('groups');

export const fetchDatasets = fetch => async () => fetch('datasets');

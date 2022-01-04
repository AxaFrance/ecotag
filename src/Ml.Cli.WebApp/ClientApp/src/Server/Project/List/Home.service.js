export const fetchProjects = fetch => async () => fetch('projects');

export const fetchDeleteProject = fetch => async id =>
  fetch(`projects/${id}`, {
    method: 'DELETE',
  });

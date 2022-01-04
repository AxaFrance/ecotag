import { fetchGroups, fetchDatasets } from './New.service';

export const init = (fetch, dispatch) => async () => {
  const datasets = await fetchDatasets(fetch)();
  const groups = await fetchGroups(fetch)();
  dispatch({ type: 'init', data: { groups, datasets } });
};

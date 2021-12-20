import { fetchProjects, fetchDeleteProject } from './Home.service';
import { convertStringDateToDateObject } from '../../date';
import React from 'react';
import { initialState, reducer } from './Home.reducer';

export const init = (fetch, dispatch) => async () => {
  const items = await fetchProjects(fetch)();
  dispatch({
    type: 'init',
    data: { items: convertStringDateToDateObject(items) },
  });
};

export const deleteProject = (fetch, dispatch) => async id => {
  dispatch({ type: 'onActionProjectsLoading' });

  await fetchDeleteProject(fetch)(id);

  await init(fetch, dispatch)();
};

export const useHome = fetch => {
  const [state, dispatch] = React.useReducer(reducer, initialState);
  const onChangePaging = ({ numberItems, page }) => dispatch({ type: 'onChangePaging', data: { numberItems, page } });
  const onChangeSort = propertyName => () => dispatch({ type: 'onChangeSort', data: { propertyName } });
  const onChangeFilter = value => dispatch({ type: 'onChangeFilter', data: { filterValue: value } });
  const onDeleteProject = id => deleteProject(fetch, dispatch)(id);
  React.useEffect(() => {
    init(fetch, dispatch)();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return {
    state,
    onChangePaging,
    onChangeFilter,
    onChangeSort,
    onDeleteProject,
  };
};

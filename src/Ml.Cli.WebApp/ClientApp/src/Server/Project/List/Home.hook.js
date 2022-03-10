import { fetchProjects } from '../Project.service';

import React from 'react';
import { initialState, reducer } from './Home.reducer';
import { resilienceStatus } from '../../shared/Resilience';

export const init = (fetch, dispatch) => async () => {
  const response = await fetchProjects(fetch)();
  let data;
  if(response.status >= 500) {
    data = {
        items: [],
        status: resilienceStatus.ERROR
      };
  } else {
    const items = await response.json();
    data = {
        items: items,
        status: resilienceStatus.SUCCESS
      };
  }
  dispatch({
    type: 'init',
    data
  });
};

export const useHome = fetch => {
  const [state, dispatch] = React.useReducer(reducer, initialState);
  const onChangePaging = ({ numberItems, page }) => dispatch({ type: 'onChangePaging', data: { numberItems, page } });
  const onChangeSort = propertyName => () => dispatch({ type: 'onChangeSort', data: { propertyName } });
  const onChangeFilter = value => dispatch({ type: 'onChangeFilter', data: { filterValue: value } });
  React.useEffect(() => {
    init(fetch, dispatch)();
  }, []);
  return {
    state,
    onChangePaging,
    onChangeFilter,
    onChangeSort
  };
};

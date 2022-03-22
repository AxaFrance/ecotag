import { fetchProjects } from '../Project.service';

import React from 'react';
import { initialState, reducer } from './Home.reducer';
import { resilienceStatus } from '../../shared/Resilience';
import {fetchGroups} from "../../Group/Group.service";

export const init = (fetch, dispatch) => async () => {
  const projectsPromise = fetchProjects(fetch)();
  const groupsPromise = fetchGroups(fetch)(false);
  const[projectsResponse, groupsResponse] = await Promise.all([projectsPromise, groupsPromise]);
  let data;
  if(projectsResponse.status >= 500 || groupsResponse.status >= 500) {
    data = {
        items: [],
        status: resilienceStatus.ERROR
      };
  } else {
    const items = await projectsResponse.json();
    const groups = await groupsResponse.json();
    data = { items, groups, status: resilienceStatus.SUCCESS };
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

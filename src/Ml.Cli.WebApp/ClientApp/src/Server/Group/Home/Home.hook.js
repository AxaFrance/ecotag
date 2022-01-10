import React from 'react';
import { fetchGroups, fetchUsers, fetchDeleteGroup, fetchCreateOrUpdateGroup } from '../Group.service';
import { reducer, initState } from './Home.reducer';
import { NAME } from './New/constants';
import {resilienceStatus} from "../../shared/Resilience";

export const initListOfGroups = (fetch, dispatch) => async () => {
  const [groupsResponse, usersResponse] = await Promise.all([fetchGroups(fetch)(), fetchUsers(fetch)()]);
  let data;
  if(groupsResponse.status >= 500 || usersResponse.status >= 500){
    data = { groups:[], users:[], status : resilienceStatus.ERROR};
  } else{

    const [groups, users] = await Promise.all([groupsResponse.json(), usersResponse.json()]);
    data = { groups, users, status : resilienceStatus.SUCCESS};
  }
  dispatch({type: 'init', data: data});

}

export const createGroup = (fetch, dispatch) => async fields => {
  dispatch({ type: 'onActionGroupLoading' });
  await fetchCreateOrUpdateGroup(fetch)({
    name: fields[NAME].value,
    users: [],
  });
  dispatch({ type: 'onSubmitCreateGroup' });
  await initListOfGroups(fetch, dispatch)();
};

export const deleteGroup = (fetch, dispatch) => async id => {
  dispatch({ type: 'onActionGroupLoading' });
  await fetchDeleteGroup(fetch)(id);
  await initListOfGroups(fetch, dispatch)();
};

export const updateUsersInGroup = async (fetch, dispatch, state, idGroup, users) => {
  dispatch({ type: 'changeUserLoading'});

  const groupToUpdate = state.items.find(group => group.id === idGroup);
  const updatedGroup = {
    id: groupToUpdate.id,
    name: groupToUpdate.name,
    users: users.map(email => ({ email })),
  };

  const response = await fetchCreateOrUpdateGroup(fetch)(updatedGroup);
  
  let data;
  if(response.status >= 500 ){
    data = {status: resilienceStatus.ERROR, updatedGroup: null };
  } else {
    data = {status: resilienceStatus.SUCCESS, updatedGroup };
  }
  dispatch({ type: 'changeUserEnded', data });
};

export const useHome = fetch => {
  const [state, dispatch] = React.useReducer(reducer, initState);
  const onChangePaging = ({ numberItems, page }) => {
    dispatch({ type: 'onChangePaging', data: { numberItems, page } });
  };
  const onDeleteGroup = id => deleteGroup(fetch, dispatch)(id);
  const onChangeCreateGroup = event => dispatch({ type: 'onChangeCreateGroup', event });
  const onSubmitCreateGroup = () => createGroup(fetch, dispatch)(state.fields);
  const onUpdateUser = (idGroup, users) => updateUsersInGroup(fetch, dispatch, state, idGroup, users);
  React.useEffect(() => {
    initListOfGroups(fetch, dispatch)();
  }, []);
  return {
    state,
    onChangePaging,
    onDeleteGroup,
    onChangeCreateGroup,
    onSubmitCreateGroup,
    onUpdateUser,
  };
};

import React from 'react';
import { fetchGroups, fetchUsers, fetchDeleteGroup, fetchCreateOrUpdateGroup } from '../Group.service';
import { reducer, initState } from './Home.reducer';
import { NAME } from './New/constants';

export const initListOfGroups = (fetch, dispatch) => async () =>
  Promise.all([fetchGroups(fetch)(), fetchUsers(fetch)()]).then(([items, eligibleUsers]) =>
    dispatch({ type: 'init', data: { items, eligibleUsers } })
  );

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
  dispatch({ type: 'changeUserLoading', data: { loading: true } });

  const groupToUpdate = state.items.find(group => group.id === idGroup);
  const updatedGroup = {
    id: groupToUpdate.id,
    name: groupToUpdate.name,
    users: users.map(email => ({ email })),
  };

  await fetchCreateOrUpdateGroup(fetch)(updatedGroup);

  dispatch({ type: 'changeUserLoading', data: { loading: false } });

  await initListOfGroups(fetch, dispatch)();
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
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

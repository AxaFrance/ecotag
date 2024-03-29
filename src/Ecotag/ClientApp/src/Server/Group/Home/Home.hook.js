import React from 'react';
import {fetchCreateGroup, fetchGroups, fetchUpdateGroup, fetchUsers} from '../Group.service';
import {initState, reducer} from './Home.reducer';
import {NAME} from './New/constants';
import {resilienceStatus} from "../../shared/Resilience";
import {telemetryEvents} from "../../Telemetry";

export const initListOfGroups = (fetch, dispatch) => async () => {
    const [groupsResponse, usersResponse] = await Promise.all([fetchGroups(fetch)(), fetchUsers(fetch)()]);
    let data;
    if (groupsResponse.status >= 500 || usersResponse.status >= 500) {
        data = {groups: [], users: [], status: resilienceStatus.ERROR};
    } else {
        const [groups, users] = await Promise.all([groupsResponse.json(), usersResponse.json()]);
        data = {groups, users, status: resilienceStatus.SUCCESS};
    }
    dispatch({type: 'init', data: data});
}

export const createGroup = (fetch, dispatch, telemetry) => async fields => {
    dispatch({type: 'onActionGroupLoading'});
    const newGroup = {
        name: fields[NAME].value.toLowerCase(),
        userIds: [],
    };
    const response = await fetchCreateGroup(fetch)(newGroup);
    let data;
    if (response.status >= 500) {
        data = {status: resilienceStatus.ERROR, newGroup: {id: null, ...newGroup}};
    } else {
        const groupId = await response.json();
        telemetry.trackEvent(telemetryEvents.CREATE_GROUP);
        data = {status: resilienceStatus.SUCCESS, newGroup: {id: groupId, ...newGroup}};
    }

    dispatch({type: 'onSubmitCreateGroup', data});
};

export const updateUsersInGroup = async (fetch, dispatch, state, idGroup, users) => {
    dispatch({type: 'changeUserLoading'});

    const groupToUpdate = state.groups.find(group => group.id === idGroup);
    const updatedGroup = {
        id: groupToUpdate.id,
        name: groupToUpdate.name,
        userIds: users,
    };

    const response = await fetchUpdateGroup(fetch)(updatedGroup);

    let data;
    if (response.status >= 500) {
        data = {status: resilienceStatus.ERROR, updatedGroup: null};
    } else {
        data = {status: resilienceStatus.SUCCESS, updatedGroup};
    }
    dispatch({type: 'changeUserEnded', data});
};

export const useHome = (fetch, telemetry) => {
    const [state, dispatch] = React.useReducer(reducer, initState);
    const onChangePaging = ({numberItems, page}) => {
        dispatch({type: 'onChangePaging', data: {numberItems, page}});
    };
    const onChangeCreateGroup = event => dispatch({type: 'onChangeCreateGroup', event});
    const onSubmitCreateGroup = () => createGroup(fetch, dispatch, telemetry)(state.fields);
    const onUpdateUser = (idGroup, users) => updateUsersInGroup(fetch, dispatch, state, idGroup, users);
    React.useEffect(() => {
        initListOfGroups(fetch, dispatch)();
    }, []);
    return {
        state,
        onChangePaging,
        onChangeCreateGroup,
        onSubmitCreateGroup,
        onUpdateUser,
    };
};

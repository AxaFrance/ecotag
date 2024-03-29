import Home from './Home';
import React from 'react';
import withCustomFetch from '../../withCustomFetch';
import {computeNumberPages, filterPaging} from '../../shared/Home/Home.filters';
import {useHome} from './Home.hook';
import {withResilience} from '../../shared/Resilience';
import {NAME} from './New/constants';
import compose from '../../compose';
import {withTelemetry} from '../../Telemetry';

const HomeWithResilience = withResilience(Home);

const NOT_FOUND = -1;
const computeEligibleUsers = (groupUserIds = [], users = []) => {
    return users.filter(user => groupUserIds.indexOf(user.id) === NOT_FOUND);
};
const computeGroupUsers = (groupUsersIds = [], allEligibleUsers = []) => {
    let users = [];
    for (let user of groupUsersIds) {
        const relatedUser = allEligibleUsers.find(usr => usr.id === user);
        users.push(relatedUser);
    }
    return users;
}

export const HomeContainer = ({fetch, telemetry}) => {
    const {state, onChangePaging, onChangeCreateGroup, onSubmitCreateGroup, onUpdateUser} = useHome(
        fetch, telemetry
    );
    const {groups, users} = state;
    const items = groups.map(group => {
        return {
            ...group,
            users: computeGroupUsers(group.userIds, users),
            eligibleUsers: computeEligibleUsers(group.userIds, users)
        }
    });
    const numberPages = computeNumberPages(items, state.filters.paging.numberItemsByPage);
    const currentPage = state.filters.paging.currentPage;
    const filters = {
        ...state.filters,
        paging: {
            ...state.filters.paging,
            numberPages,
            currentPage: currentPage > numberPages ? numberPages : currentPage,
        },
    };
    const itemsFiltered = filterPaging(items, state.filters.paging.numberItemsByPage, filters.paging.currentPage);
    const isSubmittable = !state.fields[NAME].message;

    return (
        <HomeWithResilience
            {...state}
            isSubmitable={isSubmittable}
            numberItemsTotal={items.length}
            items={itemsFiltered}
            filters={filters}
            onChangePaging={onChangePaging}
            onChangeCreateGroup={onChangeCreateGroup}
            onSubmitCreateGroup={onSubmitCreateGroup}
            onUpdateUser={onUpdateUser}
        />
    );
};

const enhance = compose(withCustomFetch(fetch), withTelemetry);

export default enhance(HomeContainer);

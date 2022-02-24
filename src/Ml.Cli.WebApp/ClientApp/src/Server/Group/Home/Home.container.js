import Home from './Home';
import React from 'react';
import withCustomFetch from '../../withCustomFetch';
import { computeNumberPages, filterPaging } from '../../shared/Home/Home.filters';
import { useHome } from './Home.hook';
import {withResilience} from "../../shared/Resilience";
import {NAME} from "./New/constants";

const HomeWithResilience = withResilience(Home);

const NOT_FOUND = -1;
const computeEligibleUsers = (groupUserIds = [], users = []) => {
  return users.filter(user => groupUserIds.indexOf(user.id) === NOT_FOUND);
};
const computeGroupUsers = (groupUsersIds = [], allEligibleUsers = []) => {
  let users = [];
  for(let user of groupUsersIds){
    const relatedUser = allEligibleUsers.find(usr => usr.id === user);
    users.push(relatedUser);
  }
  return users;
}

export const HomeContainer = ({ fetch }) => {
  const { state, onChangePaging, onChangeCreateGroup, onSubmitCreateGroup, onUpdateUser } = useHome(
    fetch
  );
  const {groups, users} = state;
  const items = groups.map(group => {return { ...group, users: computeGroupUsers(group.userIds, users), eligibleUsers : computeEligibleUsers(group.userIds, users) }});
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
  const isSubmitable = !state.fields[NAME].message;
  
  return (
    <HomeWithResilience
      {...state}
      isSubmitable={isSubmitable}
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

export default withCustomFetch(fetch)(HomeContainer);

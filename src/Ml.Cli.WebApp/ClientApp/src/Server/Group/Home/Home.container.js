import Home from './Home';
import React from 'react';
import withCustomFetch from '../../withCustomFetch';
import { computeNumberPages, filterPaging } from '../../shared/Home/Home.filters';
import { useHome } from './Home.hook';
import {withResilience} from "../../shared/Resilience";

const HomeWithResilience = withResilience(Home);

export const HomeContainer = ({ fetch }) => {
  const { state, onChangePaging, onDeleteGroup, onChangeCreateGroup, onSubmitCreateGroup, onUpdateUser } = useHome(
    fetch
  );
  const numberPages = computeNumberPages(state.items, state.filters.paging.numberItemsByPage);
  const currentPage = state.filters.paging.currentPage;
  const filters = {
    ...state.filters,
    paging: {
      ...state.filters.paging,
      numberPages,
      currentPage: currentPage > numberPages ? numberPages : currentPage,
    },
  };
  const items = filterPaging(state.items, state.filters.paging.numberItemsByPage, filters.paging.currentPage);

  return (
    <HomeWithResilience
      {...state}
      numberItemsTotal={state.items.length}
      items={items}
      filters={filters}
      onChangePaging={onChangePaging}
      onDeleteGroup={onDeleteGroup}
      onChangeCreateGroup={onChangeCreateGroup}
      onSubmitCreateGroup={onSubmitCreateGroup}
      onUpdateUser={onUpdateUser}
    />
  );
};

export default withCustomFetch(fetch)(HomeContainer);

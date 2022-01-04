import Home from './Home';
import React from 'react';
import withCustomFetch from '../../withCustomFetch';
import withLoader from '../../withLoader';
import { computeNumberPages, filterPaging } from '../../shared/Home/Home.filters';
import { useHome } from './Home.hook';

const HomeWithLoader = withLoader(Home);

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
    <HomeWithLoader
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

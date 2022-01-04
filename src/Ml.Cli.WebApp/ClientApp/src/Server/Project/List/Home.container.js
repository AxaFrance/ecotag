import Home from './Home';
import { useHome } from './Home.hook';
import React from 'react';
import withCustomFetch from '../../withCustomFetch';
import withLoader from '../../withLoader';
import { computeNumberPages, filterPaging, getItemsFiltered, getItemsSorted } from '../../shared/Home/Home.filters';

const HomeWithLoader = withLoader(Home);

export const HomeContainer = ({ fetch }) => {
  const { state, onChangePaging, onChangeFilter, onChangeSort, onDeleteProject } = useHome(fetch);
  const itemsFiltered = getItemsFiltered(state.items, state.filters.filterValue);
  const itemsSorted = getItemsSorted(itemsFiltered, state.filters.columns);
  const numberPages = computeNumberPages(itemsSorted, state.filters.paging.numberItemsByPage);
  const currentPage = state.filters.paging.currentPage;
  const filters = {
    ...state.filters,
    paging: {
      ...state.filters.paging,
      numberPages,
      currentPage: currentPage > numberPages ? numberPages : currentPage,
    },
  };
  const items = filterPaging(itemsSorted, state.filters.paging.numberItemsByPage, filters.paging.currentPage);
  return (
    <HomeWithLoader
      {...state}
      items={items}
      filters={filters}
      onChangePaging={onChangePaging}
      onChangeSort={onChangeSort}
      onChangeFilter={onChangeFilter}
      onDeleteProject={onDeleteProject}
    />
  );
};

export default withCustomFetch(fetch)(HomeContainer);

import Home from './Home';
import { useHome } from './Home.hook';
import React from 'react';
import withCustomFetch from '../../withCustomFetch';
import { withResilience } from '../../shared/Resilience';
import { computeNumberPages, filterPaging, getItemsFiltered, getItemsSorted } from '../../shared/Home/Home.filters';

const HomeWithResilience = withResilience(Home);

export const HomeContainer = ({ fetch }) => {
  const { state, onChangePaging, onChangeFilter, onChangeSort } = useHome(fetch);
  let filtersState = state.filters;
  const itemsFiltered = getItemsFiltered(state.items, filtersState.filterValue);
  const itemsSorted = getItemsSorted(itemsFiltered, filtersState.columns);
  const numberPages = computeNumberPages(itemsSorted, filtersState.paging.numberItemsByPage);
  const currentPage = filtersState.paging.currentPage;
  const filters = {
    ...filtersState,
    paging: {
      ...filtersState.paging,
      numberPages,
      currentPage: currentPage > numberPages ? numberPages : currentPage,
    },
  };
  let paging = filters.paging;
  const items = filterPaging(itemsSorted, filtersState.paging.numberItemsByPage, paging.currentPage);
  return (
    <HomeWithResilience
      {...state}
      items={items}
      filters={filters}
      onChangePaging={onChangePaging}
      onChangeSort={onChangeSort}
      onChangeFilter={onChangeFilter}
      fetch={fetch}
    />
  );
};
 
export default withCustomFetch(fetch)(HomeContainer);

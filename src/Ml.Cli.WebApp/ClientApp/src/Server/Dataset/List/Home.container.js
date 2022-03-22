import Home from './Home';
import React, { useEffect, useReducer } from 'react';
import withCustomFetch from '../../withCustomFetch';
import {computeNumberPages, filterPaging, getItemsFiltered, getItemsSorted} from '../../shared/Home/Home.filters';
import { resilienceStatus, withResilience } from '../../shared/Resilience';
import fetchDatasets from "../Dataset.service";
import {fetchGroups} from "../../Group/Group.service";

const HomeWithResilience = withResilience(Home);

const init = (fetch, dispatch) => async () => {
  const datasetsPromise = fetchDatasets(fetch)();
  const groupsPromise = fetchGroups(fetch)(true);
  const [datasetsResponse, groupsResponse] = await Promise.all([datasetsPromise, groupsPromise]);
  let data;
  if(datasetsResponse.status >= 500 || groupsResponse.status >= 500 ) {
    data = { items: [], status: resilienceStatus.ERROR };
  } else {
    const items = await datasetsResponse.json();
    const groups = await groupsResponse.json()
    data = { items, groups, status: resilienceStatus.SUCCESS };
  }
  dispatch( {type: 'init', data});
};

const reducer = (state, action) => {
  switch (action.type) {
    case 'init':
      const { items, groups, status } = action.data;
      return {
        ...state,
        status,
        items: items.map( item => {return {...item, groupName: groups.find(g => g.id === item.groupId).name}}),
      };
      case 'onChangeFilter': {
        const {filterValue} = action.data;
        if (filterValue !== null && filterValue !== undefined && filterValue.length > 2) {
          return {
            ...state,
            filters: {
              ...state.filters,
              filterValue,
            },
          };
        }
        return {
          ...state,
          filters: {
            ...state.filters,
            filterValue: null,
          },
        };
      }
    case 'onChangePaging':
      const { numberItems, page } = action.data;
      return {
        ...state,
        filters: {
          ...state.filters,
          paging: {
            numberItemsByPage: numberItems,
            currentPage: page,
          },
        },
      };
    default:
      throw new Error();
  }
};

const initialState = {
  status: resilienceStatus.LOADING,
  items: [],
  filters: {
    paging: {
      numberItemsByPage: 10,
      currentPage: 1,
    },
    filterValue :null,
    columns: {
      name: { value: null, timeLastUpdate: null },
      classification: { value: null, timeLastUpdate: null },
      numberFiles: { value: null, timeLastUpdate: null },
      createDate: { value: 'desc', timeLastUpdate: new Date() },
      type: { value: null, timeLastUpdate: null },
    } 
  },
};

const useHome = fetch => {
  const [state, dispatch] = useReducer(reducer, initialState);
  const onChangePaging = ({ numberItems, page }) => {
    dispatch({ type: 'onChangePaging', data: { numberItems, page } });
  };
  const onChangeFilter = event => dispatch({ type: 'onChangeFilter', data: { filterValue: event.target.value } });
  useEffect(() => {
    init(fetch, dispatch)();
  }, []);
  return { state, onChangePaging, onChangeFilter };
};

export const HomeContainer = ({ fetch }) => {
  const { state, onChangePaging, onChangeFilter } = useHome(fetch);
  const filtersState = state.filters;
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
  const items = filterPaging(itemsSorted, filtersState.paging.numberItemsByPage, filters.paging.currentPage);

  return <HomeWithResilience {...state} items={items} filters={filters} onChangePaging={onChangePaging} onChangeFilter={onChangeFilter} />;
};

export default withCustomFetch(fetch)(HomeContainer);

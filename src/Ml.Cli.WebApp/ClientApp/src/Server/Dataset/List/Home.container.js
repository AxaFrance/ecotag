import Home from './Home';
import fetchDatasets from './Home.service';
import { convertStringDateToDateObject } from '../../date';
import React, { useEffect, useReducer } from 'react';
import withCustomFetch from '../../withCustomFetch';
import { computeNumberPages, filterPaging, getItemsSorted } from '../../shared/Home/Home.filters';
import { resilienceStatus, withResilience } from '../../shared/Resilience';

const HomeWithResilience = withResilience(Home);

const init = (fetch, dispatch) => async () => {
  const response = await fetchDatasets(fetch)();
  let data;
  if(response.status >= 500) {
    data = { items: [], status: resilienceStatus.ERROR };
  } else {
    const items = await response.json()
    data = { items: convertStringDateToDateObject(items), status: resilienceStatus.SUCCESS };
  }
  dispatch( {type: 'init', data});
};

const reducer = (state, action) => {
  switch (action.type) {
    case 'init':
      const { items, status } = action.data;
      return {
        ...state,
        status,
        items,
      };
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
    columns: {
      name: { value: null, timeLastUpdate: null },
      classification: { value: null, timeLastUpdate: null },
      numberFiles: { value: null, timeLastUpdate: null },
      createDate: { value: null, timeLastUpdate: null },
    },
  },
};

const useHome = fetch => {
  const [state, dispatch] = useReducer(reducer, initialState);
  const onChangePaging = ({ numberItems, page }) => {
    dispatch({ type: 'onChangePaging', data: { numberItems, page } });
  };
  useEffect(() => {
    init(fetch, dispatch)();
  }, []);
  return { state, onChangePaging };
};

export const HomeContainer = ({ fetch }) => {
  const { state, onChangePaging } = useHome(fetch);
  const itemsSorted = getItemsSorted(state.items, state.filters.columns);
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

  return <HomeWithResilience {...state} items={items} filters={filters} onChangePaging={onChangePaging} onChangeSort={() => console.log("TODO: onChangeSort")}/>;
};

export default withCustomFetch(fetch)(HomeContainer);

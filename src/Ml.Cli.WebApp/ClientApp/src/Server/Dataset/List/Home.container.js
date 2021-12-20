import Home from './Home';
import fetchDatasets from './Home.service';
import { convertStringDateToDateObject } from '../../date';
import React, { useEffect, useReducer } from 'react';
import withCustomFetch from '../../withCustomFetch';
import withLoader from '../../withLoader';
import { computeNumberPages, filterPaging, getItemsSorted } from '../../shared/Home/Home.filters';

const HomeWithLoader = withLoader(Home);

const init = (fetch, dispatch) => async () => {
  const items = await fetchDatasets(fetch)();
  dispatch({
    type: 'init',
    data: { items: convertStringDateToDateObject(items) },
  });
};

const reducer = (state, action) => {
  switch (action.type) {
    case 'init':
      const { items } = action.data;
      return {
        ...state,
        loading: false,
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
  loading: true,
  items: [],
  filters: {
    paging: {
      numberItemsByPage: 10,
      currentPage: 1,
    },
    columns: {
      fullName: { value: null, timeLastUpdate: null },
      type: { value: null, timeLastUpdate: null },
      agent: { value: null, timeLastUpdate: null },
      beginDate: { value: null, timeLastUpdate: null },
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
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

  return <HomeWithLoader {...state} items={items} filters={filters} onChangePaging={onChangePaging} />;
};

export default withCustomFetch(fetch)(HomeContainer);

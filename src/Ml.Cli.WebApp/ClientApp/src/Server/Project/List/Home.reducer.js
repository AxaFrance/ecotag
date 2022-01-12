import { resilienceStatus } from '../../shared/Resilience';
import {convertStringDateToDateObject} from "../../date";

export const reducer = (state, action) => {
  switch (action.type) {
    case 'init': {
      const { items, status } = action.data;
      return {
        ...state,
        status,
        items: convertStringDateToDateObject(items),
      };
    }
    case 'onProjectDeleted':
      const { status, id } = action.data;
      if( status === resilienceStatus.ERROR) {
        return {
          ...state,
          status,
        };
      }
      const items = [...state.items];
      const item = items.find(i => i.id === id);
      if(item) {
        const index = items.indexOf(item);
        if (index > -1) {
          items.splice(index, 1);
        }
      }

      return {
        ...state,
        status,
        items
      };
    case 'onActionProjectsLoading': {
      return {
        ...state,
        loading: resilienceStatus.LOADING,
      };
    }
    case 'onChangePaging': {
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
    }
    case 'onChangeFilter': {
      const { filterValue } = action.data;
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
    case 'onChangeSort': {
      const { propertyName } = action.data;
      const columns = { ...state.filters.columns };
      const property = columns[propertyName];
      const value = property.value;
      if (value === null) {
        property.value = 'desc';
        property.timeLastUpdate = new Date().getTime();
      } else if (value === 'desc') {
        property.value = 'asc';
      } else {
        property.value = null;
        property.timeLastUpdate = null;
      }
      return {
        ...state,
        filters: {
          ...state.filters,
          columns,
        },
      };
    }
    default:
      throw new Error();
  }
};

export const initialState = {
  status: resilienceStatus.LOADING,
  items: [],
  filters: {
    paging: {
      numberItemsByPage: 10,
      currentPage: 1,
    },
    filterValue: null,
    columns: {
      name: { value: null, timeLastUpdate: null },
      classification: { value: null, timeLastUpdate: null },
      createDate: { value: 'desc', timeLastUpdate: new Date() },
      typeAnnotation: { value: null, timeLastUpdate: null },
      numberTagToDo: { value: null, timeLastUpdate: null },
    },
  },
};

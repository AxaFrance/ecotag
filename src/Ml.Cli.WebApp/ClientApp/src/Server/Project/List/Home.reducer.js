export const reducer = (state, action) => {
  switch (action.type) {
    case 'init': {
      const { items } = action.data;
      return {
        ...state,
        loading: false,
        items,
      };
    }
    case 'onActionProjectsLoading': {
      return {
        ...state,
        loading: true,
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
            ...state.paging,
            filterValue,
          },
        };
      }
      return {
        ...state,
        filters: {
          ...state.filters,
          ...state.paging,
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
  loading: true,
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

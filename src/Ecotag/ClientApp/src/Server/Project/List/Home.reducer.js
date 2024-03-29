import {resilienceStatus} from '../../shared/Resilience';

export const reducer = (state, action) => {
    switch (action.type) {
        case 'init': {
            const {items, groups, status} = action.data;
            return {
                ...state,
                status,
                items: items.map(item => {
                    return {...item, groupName: groups.find(g => g.id === item.groupId).name}
                }),
            };
        }
        case 'onActionProjectsLoading': {
            return {
                ...state,
                loading: resilienceStatus.LOADING,
            };
        }
        case 'onChangePaging': {
            const {numberItems, page} = action.data;
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
        case 'onChangeSort': {
            const {propertyName} = action.data;
            const columns = {...state.filters.columns};
            const property = columns[propertyName];
            const value = property.value;
            for (let element in columns) {
                columns[element].value = null;
                columns[element].timeLastUpdate = null;
            }
            if (value === null) {
                property.value = 'desc';
                property.timeLastUpdate = new Date().getTime();
            } else if (value === 'desc') {
                property.value = 'asc';
                property.timeLastUpdate = new Date().getTime();
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
            name: {value: null, timeLastUpdate: null},
            groupName: {value: null, timeLastUpdate: null},
            createDate: {value: 'desc', timeLastUpdate: new Date()},
            annotationType: {value: null, timeLastUpdate: null}
        },
    },
};

import Home from './Home';
import {useHome} from './Home.hook';
import React from 'react';
import withCustomFetch from '../../withCustomFetch';
import {withResilience} from '../../shared/Resilience';
import {computeNumberPages, filterPaging, getItemsFiltered, getItemsSorted} from '../../shared/Home/Home.filters';
import withAuthentication from "../../withAuthentication";
import compose from "../../compose";

const HomeWithResilience = withResilience(Home);

export const HomeContainer = ({fetch, user}) => {
    const {state, onChangePaging, onChangeFilter, onChangeSort} = useHome(fetch);
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
    const numberTotalItems = itemsSorted && itemsSorted.length ? itemsSorted.length : 0;
    return (
        <HomeWithResilience
            {...state}
            items={items}
            numberTotalItems={numberTotalItems}
            filters={filters}
            onChangePaging={onChangePaging}
            onChangeSort={onChangeSort}
            onChangeFilter={onChangeFilter}
            fetch={fetch}
            user={user}
        />
    );
};
const enhance = compose(withCustomFetch(fetch), withAuthentication());
export default enhance(HomeContainer);

import React from "react";
import {Paging} from "@axa-fr/react-toolkit-table";
import TableItem from './TableItem';
import StatsTable from './StatsTable';
import {formatJson} from "./FormatFilter";
import {computeNumberPages, filterPaging} from "../Tables/Paging";
import './TableResult.scss';

export const filterItems = (items, filterName) => {
    return items.filter(item => {
        if (filterName === "KO") {
            return item.left.Body !== item.right.Body;
        }
        if (filterName === "OK") {
            return item.left.Body === item.right.Body;
        } else {
            return items;
        }
    });
}

const reverseString = (str) => {
    const array = Array.from(str);
    return array.reverse().join("");
}

const getExtensionName = (fileName) => {
    const reversed = reverseString(fileName);
    const start = reversed.indexOf(".") + 1;
    const end = reversed.indexOf("_");
    const extension = reversed.substr(start, end - start);
    return reverseString(extension);
}

const filterExtensions = (items, extensionName) => {
    return items.filter(item => {
        if (extensionName === "All") {
            return items;
        }
        if (extensionName === "JPG/JPEG") {
            return (getExtensionName(item.fileName).toUpperCase() === "JPG" || getExtensionName(item.fileName).toUpperCase() === "JPEG");
        }
        return getExtensionName(item.fileName).toUpperCase() === extensionName;
    });
}

const filterStatusCode = (items, statusCode) => {
    if (statusCode === "All")
        return items;
    else {
        const intStatusCode = parseInt(statusCode);
        return items.filter(item => item.left.StatusCode === intStatusCode || item.right.StatusCode === intStatusCode);
    }
}

const filterSearchBar = (items, searchedString) => items.filter(item => item.fileName.includes(searchedString) ||
    item.left.Body.includes(searchedString) ||
    item.right.Body.includes(searchedString) ||
    item.left.Url.includes(searchedString) ||
    item.right.Url.includes(searchedString));

export const sortTime = (items, sortTimeType, timeCategory) => {
    const copiedArray = JSON.parse(JSON.stringify(items));
    if (sortTimeType === "Ascending") {
        copiedArray.sort((a, b) => timeCategory === "Left" ? a.left.TimeMs - b.left.TimeMs : a.right.TimeMs - b.right.TimeMs);
    } else if (sortTimeType === "Descending") {
        copiedArray.sort((a, b) => timeCategory === "Left" ? b.left.TimeMs - a.left.TimeMs : b.right.TimeMs - a.right.TimeMs);
    }
    return copiedArray;
}

const TableResult = ({state, setState, MonacoEditor, fetchFunction}) => {
    const filterScripts = formatJson(state);
    const filteredFiles = filterItems(filterScripts, state.filters.filterName);
    const filteredStatusCodes = filterStatusCode(filteredFiles, state.filters.currentStatusCode);
    const filteredExtensions = filterExtensions(filteredStatusCodes, state.filters.extensionName);
    const sortedTime = sortTime(filteredExtensions, state.filters.sortTimeType, state.filters.timeSide);
    const filteredSearchBar = filterSearchBar(sortedTime, state.filters.searchedString);

    const pageItems = filterPaging(filteredSearchBar, state.filters.pagingSelect, state.filters.pagingCurrent);

    return <>
        <StatsTable items={filterScripts} state={state} setState={setState}/>
        <TableContentMemo
            state={state}
            pageItems={pageItems}
            filteredSearchBar={filteredSearchBar}
            setState={setState}
            MonacoEditor={MonacoEditor}
            fetchFunction={fetchFunction}
        />
    </>;
}

const TableContent = ({state, pageItems, filteredSearchBar, setState, MonacoEditor, fetchFunction}) => {
    const setParentState = (newData) => setState({...state, ...newData});
    if (pageItems.items.length === 0) {
        return <h2 className="error-message">There is no file related to that filter configuration !</h2>;
    }
    const currentPage = pageItems.currentPage === -1 ? computeNumberPages(filteredSearchBar, state.filters.pagingSelect) : pageItems.currentPage;
    const numberPages = computeNumberPages(filteredSearchBar, state.filters.pagingSelect);
    const onPagingChange = e => {
        const numberPages = computeNumberPages(filteredSearchBar, e.numberItems);
        setState({
            ...state,
            filters: {
                ...state.filters,
                pagingSelect: e.numberItems,
                pagingCurrent: state.filters.pagingCurrent > numberPages ? numberPages : e.page
            }
        });
    }
    
    return <>
        <div className="paging__top">
            <Paging
                currentPage={currentPage}
                numberPages={numberPages}
                numberItems={state.filters.pagingSelect}
                id="paging-top"
                onChange={onPagingChange}
            />
        </div>
        
        {pageItems.items.map(item => (
            <TableItem
                key={item.id}
                item={item}
                items={state.items}
                stringsMatcher={state.filters.stringsModifier}
                isAnnotating={state.isAnnotationOpen}
                setCompareState={setParentState}
                compareLocation={state.compareLocation}
                MonacoEditor={MonacoEditor}
                fetchFunction={fetchFunction}
            />
        ))}

        <Paging
            currentPage={currentPage}
            numberPages={numberPages}
            numberItems={state.filters.pagingSelect}
            id="paging-bottom"
            previousLabel="Previous"
            nextLabel="Next"
            displayLabel="Show"
            elementsLabel="elements"
            onChange={onPagingChange}
        />
    </>
}

const TableContentMemo = React.memo(TableContent)

export default TableResult;

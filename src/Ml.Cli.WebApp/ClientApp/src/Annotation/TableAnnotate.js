import React, {useState} from "react";
import {Paging} from "@axa-fr/react-toolkit-table";
import TableAnnotateItem from "./TableAnnotateItem";
import {computeNumberPages, filterPaging} from "../Tables/Paging";
import './TableAnnotate.scss';

const TableAnnotate = ({state, MonacoEditor, fetchFunction}) => {

    const [tableState, setTableState] = useState({
        currentPage: 1,
        pagingSelect: 50
    });
    
    const pageItems = filterPaging(state.items, tableState.pagingSelect, tableState.currentPage);
    const currentPage = pageItems.currentPage === -1 ? computeNumberPages(state.items, tableState.pagingSelect) : pageItems.currentPage;
    
    if(pageItems.items.length === 0){
        return <h2 className="error-message">Le fichier d'annotation est vide.</h2>
    }
    
    const numberPages = computeNumberPages(state.items, tableState.pagingSelect);
    const onPagingChange = e => {
        const newNumberPages = computeNumberPages(state.items, e.numberItems);
        setTableState({
            currentPage: state.currentPage > newNumberPages ? newNumberPages : e.page,
            pagingSelect: e.numberItems
        });
    }

    return <>
        <Paging
            id="paging-top"
            className="af-paging paging__top"
            currentPage={currentPage}
            numberPages={numberPages}
            numberItems={tableState.pagingSelect}
            onChange={onPagingChange}
        />
        
        {pageItems.items.map(item => (
            <TableAnnotateItem
                parentState={state}
                fetchFunction={fetchFunction}
                key={item.id}
                item={item}
                MonacoEditor={MonacoEditor}
            />
        ))}
        <Paging
            id="paging-bottom"
            currentPage={currentPage}
            numberPages={numberPages}
            numberItems={tableState.pagingSelect}
            previousLabel="Previous"
            nextLabel="Next"
            displayLabel="Show"
            elementsLabel="elements"
            onChange={onPagingChange}
        />
    </>;
};

export default TableAnnotate;

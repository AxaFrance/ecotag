import React, {useState} from "react";
import {Paging} from "@axa-fr/react-toolkit-table";
import TableAnnotateItem from "./TableAnnotateItem";
import {computeNumberPages} from "../Tables/Paging";

const TableAnnotate = ({state, MonacoEditor, fetchFunction}) => {

    const [tableState, setTableState] = useState({
        currentPage: 1,
        pagingSelect: 50
    });

    return <>
        {state.items.map(item => (
            <TableAnnotateItem 
                fetchFunction={fetchFunction}
                key={item.id}
                item={item}
                MonacoEditor={MonacoEditor}
            />
        ))}
        <Paging
            id="paging"
            currentPage={tableState.currentPage}
            numberPages={computeNumberPages(state.items, tableState.pagingSelect)}
            numberItems={tableState.pagingSelect}
            onChange={e => {
                const newNumberPages = computeNumberPages(state.items, e.numberItems);
                setTableState({
                    ...state,
                    currentPage: state.currentPage > newNumberPages ? newNumberPages : e.page,
                    pagingSelect: e.numberItems
                });
            }
            }
        />
    </>;
};

export default TableAnnotate;

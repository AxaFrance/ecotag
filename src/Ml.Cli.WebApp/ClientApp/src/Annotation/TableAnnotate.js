import React, {useEffect, useState} from "react";
import AnnotationItem from "./AnnotationItem";
import './TableAnnotate.scss';

const TableAnnotate = ({state, MonacoEditor, fetchFunction}) => {
    
    const [tableState, setTableState] = useState({
        item: state.items[0],
        itemNumber: 0
    });

    useEffect(() => {
        setTableState({item: state.items[0], itemNumber: 0});
    }, [state]);
    
    const onSubmit = () => {
        setTableState({...tableState, item: state.items[tableState.itemNumber + 1], itemNumber: tableState.itemNumber + 1});
    }

    return <AnnotationItem
        parentState={state}
        fetchFunction={fetchFunction}
        key={tableState.item.id}
        item={tableState.item}
        onSubmit={onSubmit}
        MonacoEditor={MonacoEditor}
    />;
};

export default TableAnnotate;

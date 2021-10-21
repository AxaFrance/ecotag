import React, {useEffect, useState} from "react";
import AnnotationItem from "./AnnotationItem";
import AnnotationsToolbar from "./AnnotationsToolbar";

const TableAnnotate = ({state, MonacoEditor, fetchFunction}) => {
    
    const [tableState, setTableState] = useState({
        item: state.items[0],
        itemNumber: 0
    });
    
    //setting the component back to original state when new file is inserted
    useEffect(() => {
        setTableState({item: state.items[0], itemNumber: 0});
    }, [state]);
    
    const onSubmit = () => {
        setTableState({...tableState, item: state.items[tableState.itemNumber + 1], itemNumber: tableState.itemNumber + 1});
    }
    
    const onPrevious = () => {
        if(tableState.itemNumber > 0){
            setTableState({...tableState, item: state.items[tableState.itemNumber - 1], itemNumber: tableState.itemNumber - 1});
        }
    };
    
    const onNext = () => {
        if(tableState.itemNumber < state.items.length - 1){
            setTableState({...tableState, item: state.items[tableState.itemNumber + 1], itemNumber: tableState.itemNumber + 1});
        }
    };

    return <>
        <AnnotationItem
            parentState={state}
            fetchFunction={fetchFunction}
            key={tableState.item.id}
            item={tableState.item}
            onSubmit={onSubmit}
            MonacoEditor={MonacoEditor}
        />
        <AnnotationsToolbar
            onPrevious={onPrevious}
            onPreviousPlaceholder="Précédent"
            onNext={onNext}
            onNextPlaceholder="Suivant"
        />
    </>;
};

export default TableAnnotate;

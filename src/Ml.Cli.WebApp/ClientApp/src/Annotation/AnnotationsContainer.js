import React, {useEffect, useState} from "react";
import AnnotationItem from "./AnnotationItem";
import AnnotationsToolbar from "./AnnotationsToolbar";
import './AnnotationsContainer.scss';

const sortByAnnotations = (items) => {
    return items.sort((a, b) => (a.annotations.length > b.annotations.length) ? 1 : -1);
}

const AnnotationsContainer = ({state, MonacoEditor, fetchFunction}) => {
    
    const [tableState, setTableState] = useState({
        tableItems: sortByAnnotations(state.items),
        itemNumber: 0,
        isEndReached: false
    });
    
    //setting the component back to original state when new file is inserted
    useEffect(() => {
        setTableState({tableItems: sortByAnnotations(state.items), itemNumber: 0, isEndReached: false});
    }, [state]);
    
    const onSubmit = () => {
        setTableState({...tableState, itemNumber: tableState.itemNumber + 1});
    }
    
    const onPrevious = () => {
        if(tableState.isEndReached){
            setTableState({...tableState, itemNumber: tableState.itemNumber, isEndReached: false});
        }
        else if(tableState.itemNumber > 0){
            setTableState({...tableState, itemNumber: tableState.itemNumber - 1});
        }
    };
    
    const onNext = () => {
        if(tableState.itemNumber < state.items.length - 1){
            setTableState({...tableState, itemNumber: tableState.itemNumber + 1});
        }
        else{
            setTableState({...tableState, isEndReached: true});
        }
    };

    return <>
        <AnnotationsToolbar
            onPrevious={onPrevious}
            onPreviousPlaceholder="Précédent"
            isPreviousDisabled={tableState.itemNumber === 0}
            onNext={onNext}
            onNextPlaceholder="Suivant"
            isNextDisabled={tableState.isEndReached}
        />
        {tableState.isEndReached ? (
            <h3 className="end-message">Thank you, all files from this dataset have been annotated.</h3>
        ) : (
            <AnnotationItem
                parentState={state}
                fetchFunction={fetchFunction}
                key={tableState.tableItems[tableState.itemNumber].id}
                item={tableState.tableItems[tableState.itemNumber]}
                onSubmit={onSubmit}
                MonacoEditor={MonacoEditor}
            />
        )}
    </>;
};

export default AnnotationsContainer;

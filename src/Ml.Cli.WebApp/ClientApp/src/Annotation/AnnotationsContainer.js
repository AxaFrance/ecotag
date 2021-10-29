import React, {useState} from "react";
import AnnotationItem from "./AnnotationItem";
import AnnotationsToolbar from "./AnnotationsToolbar";
import './AnnotationsContainer.scss';

const AnnotationsContainer = ({state, entryItem, MonacoEditor, fetchFunction}) => {
    
    const [tableState, setTableState] = useState({
        itemNumber: state.items.indexOf(entryItem)
    });
    
    const onSubmit = () => {
        setTableState({itemNumber: tableState.itemNumber + 1});
    }
    
    const onPrevious = () => {
        setTableState({itemNumber: tableState.itemNumber - 1});
    };
    
    const onNext = () => {
        if(tableState.itemNumber < state.items.length){
            setTableState({itemNumber: tableState.itemNumber + 1});
        }
    };
    
    const currentItem = state.items[tableState.itemNumber];
    const isEndReached = (tableState.itemNumber >= state.items.length);

    return <>
        <AnnotationsToolbar
            onPrevious={onPrevious}
            onPreviousPlaceholder="Précédent"
            isPreviousDisabled={tableState.itemNumber === 0}
            onNext={onNext}
            onNextPlaceholder="Suivant"
            isNextDisabled={isEndReached}
        />
        {isEndReached ? (
            <h3 className="annotation__end-message">Thank you, all files from this dataset have been annotated.</h3>
        ) : (
            <AnnotationItem
                parentState={state}
                fetchFunction={fetchFunction}
                key={currentItem.id}
                item={currentItem}
                onSubmit={onSubmit}
                MonacoEditor={MonacoEditor}
            />
        )}
    </>;
};

export default AnnotationsContainer;

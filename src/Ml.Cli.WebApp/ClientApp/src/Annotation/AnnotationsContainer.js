import React, {useEffect, useState} from "react";
import AnnotationItem from "./AnnotationItem";
import AnnotationsToolbar from "./AnnotationsToolbar";
import './AnnotationsContainer.scss';
import {useHistory} from "react-router";

const selectItemById = (annotationState, id) => {
    if(id === "end")
        return null;
    return annotationState.items.find(x => x.id === id);
};

const AnnotationsContainer = ({state, id, url, dataset, MonacoEditor, fetchFunction}) => {
    const history = useHistory();

    const entryItem = selectItemById(state, id);
    const itemNumber= state.items.indexOf(entryItem);

    useEffect(() => {
        console.log("youhou2")
    }, []);
    
    const onSubmit = () => {
        onNext();
    }
    
    const onPrevious = () => {
        if(id === "end"){
            history.push(`${url}/${dataset}/${state.items[state.items.length - 1].id}`);
        } else{
            history.push(`${url}/${dataset}/${state.items[itemNumber - 1].id}`);
        }
    };
    
    const onNext = () => {
        if((itemNumber + 1) < state.items.length){
            history.push(`${url}/${dataset}/${state.items[itemNumber + 1].id}`);
        } else {
            history.push(`${url}/${dataset}/end`);
        }
    };

    const isPreviousDisabled = itemNumber === 0;
    const isNextDisabled = entryItem == null;
    const isEndReached = entryItem == null;

    return <>
        <AnnotationsToolbar
            onPrevious={onPrevious}
            isPreviousDisabled={isPreviousDisabled}
            onNext={onNext}
            isNextDisabled={isNextDisabled}
        />
        {isEndReached ? (
            <h3 className="annotation__end-message">Thank you, all files from this dataset have been annotated.</h3>
        ) : (
            <AnnotationItem
                parentState={state}
                fetchFunction={fetchFunction}
                key={entryItem.id}
                item={entryItem}
                onSubmit={onSubmit}
                MonacoEditor={MonacoEditor}
            />
        )}
    </>;
};

export default React.memo(AnnotationsContainer);

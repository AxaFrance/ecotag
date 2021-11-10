import AnnotationsToolbar from "./AnnotationsToolbar";
import AnnotationSwitch from "./AnnotationSwitch";
import React from "react";
import './Annotations.scss';

const Annotations = ({onPrevious, isPreviousDisabled, onNext, toolbarText, isNextDisabled, annotationType, url, onSubmit, expectedOutput, isEmpty, labels}) => {

    if(isEmpty){
        return <h2 className="error-message">The annotation file is empty.</h2>
    }
   
    return <>
        <AnnotationsToolbar
            onPrevious={onPrevious}
            isPreviousDisabled={isPreviousDisabled}
            onNext={onNext}
            text={toolbarText}
            isNextDisabled={isNextDisabled}
        />
        {isNextDisabled ? (
            <h3 className="annotation__end-message">No more file to annotate</h3>
        ) : (
            <AnnotationSwitch
                url={url}
                annotationType={annotationType}
                labels={labels}
                expectedOutput={expectedOutput}
                onSubmit={onSubmit}
            />
        )}
    </>;
}

export default Annotations;
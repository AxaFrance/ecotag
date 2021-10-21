import React from "react";
import Button from "@axa-fr/react-toolkit-button";
import './AnnotationsToolbar.scss';

const AnnotationsToolbar = ({onPrevious, onPreviousPlaceholder, onNext, onNextPlaceholder}) => {
    
    return(
        <div className="annotations-toolbar">
            <Button onClick={onPrevious}>{onPreviousPlaceholder}</Button>
            <Button onClick={onNext}>{onNextPlaceholder}</Button>
        </div>
    );
};

export default AnnotationsToolbar;
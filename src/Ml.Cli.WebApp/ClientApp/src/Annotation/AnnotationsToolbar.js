import React from "react";
import Button from "@axa-fr/react-toolkit-button";
import './AnnotationsToolbar.scss';

const AnnotationsToolbar = ({onPrevious, onPreviousPlaceholder, isPreviousDisabled, onNext, onNextPlaceholder, isNextDisabled}) => {
    
    return(
        <div className="annotations-toolbar">
            <div className={isPreviousDisabled ? "annotations-toolbar__hidden-container" : ""}>
                <Button onClick={onPrevious} classModifier="hasiconLeft" glyphicon="glyphicon glyphicon-arrowthin-left" disabled={isPreviousDisabled}>{onPreviousPlaceholder}</Button>
            </div>
            <div className={isNextDisabled ? "annotations-toolbar__hidden-container" : ""}>
                <Button onClick={onNext} classModifier="hasiconRight" glyphicon="glyphicon glyphicon-arrowthin-right" disabled={isNextDisabled}>{onNextPlaceholder}</Button>
            </div>
        </div>
    );
};

export default AnnotationsToolbar;
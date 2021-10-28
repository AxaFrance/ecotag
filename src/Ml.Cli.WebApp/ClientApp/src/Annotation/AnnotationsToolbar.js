import React from "react";
import Button from "@axa-fr/react-toolkit-button";
import './AnnotationsToolbar.scss';

const AnnotationsToolbar = ({onPrevious, onPreviousPlaceholder, isPreviousDisabled, onNext, onNextPlaceholder, isNextDisabled}) => {
    
    const setModifier = (side, isDisabled) => {
        let returnedValue = (side === "left" ? "hasiconLeft" : "hasiconRight");
        if(isDisabled){
            returnedValue += " disabled";
        }
        return returnedValue;
    }
    
    return(
        <div className="annotation__top-toolbar">
            <Button onClick={onPrevious} classModifier={setModifier("left", isPreviousDisabled)} glyphicon="glyphicon glyphicon-arrowthin-left" disabled={isPreviousDisabled}>{onPreviousPlaceholder}</Button>
            <Button onClick={onNext} classModifier={setModifier("right", isNextDisabled)} glyphicon="glyphicon glyphicon-arrowthin-right" disabled={isNextDisabled}>{onNextPlaceholder}</Button>
        </div>
    );
};

export default AnnotationsToolbar;
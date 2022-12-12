import React from "react";
import Button from "@axa-fr/react-toolkit-button";
import '@axa-fr/react-toolkit-core/dist/assets/fonts/icons/af-icons.css';
import './AnnotationsToolbar.scss';

const setModifier = (side, isDisabled) => {
    let returnedValue = (side === "left" ? "hasiconLeft" : "hasiconRight");
    if (isDisabled) {
        returnedValue += " disabled";
    }
    return returnedValue;
}


const AnnotationsToolbar = ({
                                onPrevious,
                                text = "",
                                onPreviousPlaceholder = "Previous",
                                isPreviousDisabled,
                                onNext,
                                onNextPlaceholder = "Next",
                                isNextDisabled
                            }) => {
    return (
        <div className="annotation__top-toolbar">
            <Button onClick={onPrevious} classModifier={setModifier("left", isPreviousDisabled)}
                    disabled={isPreviousDisabled}>
                <span className="af-btn__text">
                  {onPreviousPlaceholder}
                </span>
                <i className="glyphicon glyphicon-arrowthin-left"/>
            </Button>
            <span className="annotation__top-toolbar-text">{text}</span>
            <Button onClick={onNext} classModifier={setModifier("right", isNextDisabled)} disabled={isNextDisabled}>
                 <span className="af-btn__text">
                  {onNextPlaceholder}
                </span>
                <i className="glyphicon glyphicon-arrowthin-right"/>
            </Button>
        </div>
    );
};

export default AnnotationsToolbar;
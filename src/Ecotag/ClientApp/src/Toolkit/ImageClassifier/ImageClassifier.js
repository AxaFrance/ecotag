import React from "react";
import stringToRGB from "./color";
import '../BoundingBox/Labels.scss';
import './ImageClassifier.scss';
import '@axa-fr/react-toolkit-button/src/button.scss'
import classNames from "classnames";
import {GlobalHotKeys} from 'react-hotkeys';
import {generateLabelsKeyMap} from "../labels";
import useProjectTranslation from "../../translations/useProjectTranslation";

const defaultClassName = 'image-classifier';
const defaultClassNameButtonsContainer = 'image-classifier__buttons-container';
const defaultClassNameButtonContainer = 'image-classifier__button-container';

const generateKeyMap = (length) => {
    let result = {};
    generateLabelsKeyMap(result, length)
    return result;
};

const ImageClassifier = ({url, labels, onSubmit, state, expectedOutput}) => {
    const {translate} = useProjectTranslation('toolkit');
    const className = classNames(defaultClassName, {
        [`${defaultClassName}--inline-mode`]: state.inlineMode,
    });
    const classNameButtonsContainer = classNames(defaultClassNameButtonsContainer, {
        [`${defaultClassNameButtonsContainer}--inline-mode`]: state.inlineMode,
    });
    const classNameButtonContainer = classNames(defaultClassNameButtonContainer, {
        [`${defaultClassNameButtonContainer}--inline-mode`]: state.inlineMode,
    });
    const coloredLabels = labels.map((label) => {
        return {
            "name": label.name,
            "color": label.color ? label.color : `#${stringToRGB(label.name)}`
        };
    });
    const generateHandler = () => {
        let result = {};
        for (let i = 1; i <= coloredLabels.length; i++) {
            result[`${i.toString(16)}`] = () => onSubmit(coloredLabels[i - 1].name);
        }
        return result;
    }
    const keyMap = generateKeyMap(coloredLabels.length);
    const handlers = generateHandler();
    return (
        <>
            <GlobalHotKeys allowChanges={true} keyMap={keyMap} handlers={handlers}>
                <div className={className}>
                    <div className="image-classifier__image-container">
                        <img
                            src={url}
                            id="currentImage"
                            alt={translate('image_classifier.image_alt')}
                            style={{
                                width: `${state.widthImage}%`,
                                transform: `rotate(${state.rotate}deg)`,
                                margin: `${state.initialRotate ? '' : state.marginRotate}`,
                            }}
                        />
                    </div>
                    <div className={classNameButtonsContainer}>
                        {coloredLabels.map((label, index) => {
                            let isSelected = false;
                            if (expectedOutput !== null && expectedOutput !== undefined && expectedOutput.label === label.name) {
                                isSelected = true;
                            }
                            return (
                                <div title={`${translate('image_classifier.shortcut')} ${keyMap[(index + 1).toString(16)]}`} key={index}
                                     className={classNameButtonContainer}>
                                    <button
                                        className={`image-classifier-btn${isSelected ? " image-classifier-btn--selected" : ""}`}
                                        onClick={() => onSubmit(label.name)}
                                        style={{backgroundColor: label.color}}>{label.name}</button>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </GlobalHotKeys>
        </>
    );
};

export default ImageClassifier;
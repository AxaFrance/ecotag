﻿import React from "react";
import Button from "@axa-fr/react-toolkit-button";
import stringToRGB from "./color";
import '../BoundingBox/Labels.scss';
import './ImageClassifier.scss';
import '@axa-fr/react-toolkit-button/src/button.scss'

const ImageClassifier = ({url, labels, onSubmit}) => {
    
    const coloredLabels = labels.map((label) => {
        return {
            "name": label.name,
            "color": `#${stringToRGB(label.name)}`
        };
    });
    
    return(
        <div className="image-classifier">
            <div className="image-classifier__buttons-container">
                {coloredLabels.map((label, index) => {
                    return(
                        <div key={index} className="image-classifier__button-container">
                            <Button onClick={() => onSubmit(label.name)} style={{backgroundColor: label.color, boxShadow: "none"}}>{label.name}</Button>
                        </div>
                    );
                })}
            </div>
            <div className="image-classifier__image-container">
                <img src={url} className="image-classifier__image" alt="Classifier image"/>
            </div>
        </div>
    );
};

export default ImageClassifier;
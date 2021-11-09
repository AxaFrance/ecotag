﻿import React from "react";
import CroppingLazy from "./Toolkit/BoundingBox/CroppingLazy";
import OcrLazy from "./Toolkit/Ocr/OcrLazy";
import TagOverTextLabelLazy from "./Toolkit/TagOverTextLabel/TagOverTextLabelLazy";
import TagOverTextLazy from "./Toolkit/TagOverText/TagOverTextLazy";
import IrotLazy from "./Toolkit/Rotation/IrotLazy";
import NamedEntityLazy from "./Toolkit/NamedEntity/NamedEntityLazy";

import ImageClassifierLazy from "./Toolkit/ImageClassifier/ImageClassifierLazy";


const setAnnotationObject = (annotationType, e) => {
    switch (annotationType) {
        case "Ocr":
            return {
                "type": e.type,
                "width": e.width,
                "height": e.height,
                "labels": e.labels
            };
        case "Cropping":
            return {
                "type": e.type,
                "width": e.width,
                "height": e.height,
                "labels": e.labels
            };
        case "Rotation":
            return {
                "type": e.type,
                "width": e.width,
                "height": e.height,
                "labels": e.labels,
                "image_anomaly": e.image_anomaly
            }
        case "TagOverText":
            return {
                "type": e.type,
                "width": e.width,
                "height": e.height,
                "labels": e.labels
            }
        case "TagOverTextLabel":
            return {
                "type": e.type,
                "width": e.width,
                "height": e.height,
                "labels": e.labels
            };
        case "NamedEntityRecognition":
            return e;
        case "ImageClassifier":
            return {
                "label": e
            };
    }
    return null;
}

const AnnotationImagesLoader = ({url, annotationType, labels, expectedOutput, onSubmit}) => {
    
    const onDatasetSubmit = async e => {
        onSubmit(setAnnotationObject(annotationType, e));
    }
    
    switch (annotationType) {
        case "Ocr":
            return <OcrLazy
                labels={labels}
                expectedLabels={[]}
                url={url}
                onSubmit={onDatasetSubmit}
            />
        case "Cropping":
            return  <CroppingLazy
                labels={labels}
                url={url}
                onSubmit={onDatasetSubmit}
            />
        case "Rotation":
            return <IrotLazy
                expectedLabels={[]}
                url={url}
                onSubmit={onDatasetSubmit}
            />
        case "TagOverText":
            return <TagOverTextLazy
                expectedOutput={expectedOutput}
                url={url}
                onSubmit={onDatasetSubmit}
            />
        case "TagOverTextLabel":
            return  <TagOverTextLabelLazy
                expectedOutput={expectedOutput}
                url={url}
                onSubmit={onDatasetSubmit}
                labels={labels}
            />
        case "NamedEntityRecognition":
            return  <NamedEntityLazy
                text={"Hello, my name is Lilian Delouvy, and this is some sample text.  The NER is currently in a 'Work In Progress' state. And it will be awesome. bla bla . bla bla . bla bla . bla bla . bla bla "}
                labels={labels}
                annotationAction={onDatasetSubmit}
                placeholder="Submit Annotation"
            />
        case "ImageClassifier":
            return <ImageClassifierLazy
                url={url}
                labels={labels}
                onSubmit={onDatasetSubmit}
            />
    }
    
};

export default React.memo(AnnotationImagesLoader);

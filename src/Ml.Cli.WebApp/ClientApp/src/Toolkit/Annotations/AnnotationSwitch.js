import React from "react";
import CroppingLazy from "../BoundingBox/CroppingLazy";
import OcrLazy from "../Ocr/OcrLazy";
import TagOverTextLabelLazy from "../TagOverTextLabel/TagOverTextLabelLazy";
import TagOverTextLazy from "../TagOverText/TagOverTextLazy";
import IrotLazy from "../Rotation/IrotLazy";
import NamedEntityLazy from "../NamedEntity/NamedEntityLazy";

import ImageClassifierLazy from "../ImageClassifier/ImageClassifierLazy";


const setAnnotationObject = (annotationType, e) => {
    switch (annotationType) {
        case "TagOverTextLabel":
        case "TagOverText":
        case "Ocr":
        case "OCR":
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
        case "NamedEntityRecognition":
            return e;
        case "ImageClassifier":
            return {
                "label": e
            };
    }
    return null;
}

const AnnotationSwitch = ({url, annotationType, labels, expectedOutput={}, onSubmit}) => {
    
    const onDatasetSubmit = async e => {
        onSubmit(setAnnotationObject(annotationType, e));
    }
    
    switch (annotationType) {
        case "Ocr":
        case 'OCR':
            return <OcrLazy
                labels={labels}
                expectedLabels={expectedOutput?expectedOutput.labels : null}
                url={url}
                onSubmit={onDatasetSubmit}
            />
        case "Cropping":
        case 'CROPPING':
            return  <CroppingLazy
                labels={labels}
                url={url}
                onSubmit={onDatasetSubmit}
            />
        case "Rotation":
        case 'IROT':
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
        case 'NER':
            return  <NamedEntityLazy
                text={"Hello, my name is Lilian Delouvy, and this is some sample text.  The NER is currently in a 'Work In Progress' state. And it will be awesome. bla bla . bla bla . bla bla . bla bla . bla bla "}
                labels={labels}
                onSubmit={onDatasetSubmit}
                placeholder="Submit Annotation"
            />
        case "ImageClassifier":
            return <ImageClassifierLazy
                url={url}
                labels={labels}
                onSubmit={onDatasetSubmit}
            />
        default:
            return <></>
    }
    
};

export default React.memo(AnnotationSwitch);

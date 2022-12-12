import React from "react";
import CroppingLazy from "../BoundingBox/CroppingLazy";
import OcrLazy from "../Ocr/OcrLazy";
import TagOverTextLabelLazy from "../TagOverTextLabel/TagOverTextLabelLazy";
import TagOverTextLazy from "../TagOverText/TagOverTextLazy";
import IrotLazy from "../Rotation/IrotLazy";
import NamedEntityLazy from "../NamedEntity/NamedEntityLazy";

import ImageClassifierLazy from "../ImageClassifier/ImageClassifierLazy";
import EmlClassifierLazy from "../EmlClassifier/EmlClassifierLazy";
import {EmlMode} from "../EmlClassifier/EmlMode";


const setAnnotationObject = (annotationType, e) => {
    switch (annotationType) {
        case "TagOverTextLabel":
        case "TagOverText":
        case "Ocr":
        case "OCR":
        case "Cropping":
        case 'CROPPING':
            return {
                "type": e.type,
                "width": e.width,
                "height": e.height,
                "labels": e.labels
            };
        case 'DocumentOcr':
            return {
                "labels": e
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
        case "NamedEntity":
        case 'NER':
            return e;
        case "ImageClassifier":
        case "EmlClassifier":
        case "DocumentClassifier":
            return {
                "label": e
            };
    }
    return null;
}

const AnnotationSwitch = ({url, annotationType, labels, filename, expectedOutput = {}, onSubmit}) => {

    const onDatasetSubmit = async e => {
        onSubmit(setAnnotationObject(annotationType, e));
    }

    switch (annotationType) {
        case "Ocr":
        case 'OCR':
            return <OcrLazy
                labels={labels}
                expectedLabels={expectedOutput ? expectedOutput.labels : null}
                url={url}
                onSubmit={onDatasetSubmit}
            />
        case "Cropping":
        case 'CROPPING':
            return <CroppingLazy
                labels={labels}
                url={url}
                expectedOutput={expectedOutput}
                onSubmit={onDatasetSubmit}
            />
        case "Rotation":
        case 'IROT':
            return <IrotLazy
                expectedOutput={expectedOutput}
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
            return <TagOverTextLabelLazy
                expectedOutput={expectedOutput}
                url={url}
                onSubmit={onDatasetSubmit}
                labels={labels}
            />
        case "NamedEntityRecognition":
        case "NamedEntity":
        case 'NER':
            return <NamedEntityLazy
                url={url}
                labels={labels}
                expectedOutput={expectedOutput}
                onSubmit={onDatasetSubmit}
                placeholder="Submit Annotation"
            />
        case "ImageClassifier":
            return <ImageClassifierLazy
                url={url}
                labels={labels}
                onSubmit={onDatasetSubmit}
                expectedOutput={expectedOutput}
            />
        case "EmlClassifier":
        case "DocumentClassifier":
            return <EmlClassifierLazy
                url={url}
                labels={labels}
                onSubmit={onDatasetSubmit}
                expectedOutput={expectedOutput}
                filename={filename}
                mode={EmlMode.classifier}
            />
        case "DocumentOcr":
            return <EmlClassifierLazy
                url={url}
                labels={labels}
                onSubmit={onDatasetSubmit}
                expectedOutput={expectedOutput}
                filename={filename}
                mode={EmlMode.ocr}
            />
        default:
            return <></>
    }

};

export default React.memo(AnnotationSwitch);

import {ReservationStatus} from "./ReservationStatus";
import {AnnotationStatus} from "./AnnotationStatus";
import AnnotationsToolbar from "../../../Toolkit/Annotations/AnnotationsToolbar";
import Alert from '@axa-fr/react-toolkit-alert';
import React from "react";
import AnnotationSwitch from "../../../Toolkit/Annotations/AnnotationSwitch";

const AnnotationDispatch = ({ typeAnnotation, labels, url, onSubmit,expectedOutput={} }) => {
    return <AnnotationSwitch
        url={url}
        annotationType={typeAnnotation}
        labels ={labels}
        expectedOutput={expectedOutput}
        onSubmit={onSubmit}
    />
};

export const Content = ({project, currentItem, onSubmit, onNext, onPrevious, hasPrevious, hasNext, documentId, reservationStatus, annotationStatus, apiUrl}) => {
    switch (documentId) {
        case "end":
            return <div className="container"><Alert classModifier="info" title="Annotation">
                L'annotation de ce dataset est terminé.
                Merci beaucoup !
            </Alert></div>;
        case "start":
            return <div className="container"><Alert classModifier="success" title="Annotation">
                Chargement en cours
            </Alert></div>;
        default:
            return (currentItem != null ? <>
                <ReservationStatus status={reservationStatus}/>
                <AnnotationStatus status={annotationStatus}/>
                <AnnotationsToolbar onPreviousPlaceholder={"Précédent"} onNextPlaceholder={"Suivant"} onNext={onNext}
                                    onPrevious={onPrevious} isPreviousDisabled={!hasPrevious} isNextDisabled={!hasNext}
                                    text={currentItem.fileName}/>
                <AnnotationDispatch expectedOutput={currentItem.annotation.expectedOutput}
                                    typeAnnotation={project.typeAnnotation} labels={project.labels} onSubmit={onSubmit}
                                    url={ apiUrl.replace('{path}', `projects/${project.id}/files/${currentItem.fileId}`)} />
            </> : null);
    }
}
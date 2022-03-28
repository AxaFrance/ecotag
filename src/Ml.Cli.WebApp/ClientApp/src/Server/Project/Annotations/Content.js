import {ReservationStatus} from "./ReservationStatus";
import {AnnotationStatus} from "./AnnotationStatus";
import AnnotationsToolbar from "../../../Toolkit/Annotations/AnnotationsToolbar";
import Alert from '@axa-fr/react-toolkit-alert';
import React from "react";
import AnnotationSwitch from "../../../Toolkit/Annotations/AnnotationSwitch";
import Loader, { LoaderModes } from '@axa-fr/react-toolkit-loader';

const AnnotationDispatch = ({ annotationType, labels, url, onSubmit,expectedOutput={} }) => {
    return <AnnotationSwitch
        url={url}
        annotationType={annotationType}
        labels ={labels}
        expectedOutput={expectedOutput}
        onSubmit={onSubmit}
    />
};

export const Content = ({project, currentItem, onSubmit, onNext, onPrevious, hasPrevious, hasNext, documentId, reservationStatus, annotationStatus}) => {
    switch (documentId) {
        case "end":
            return <div className="container"><Alert classModifier="info" title="Annotation">
                L'annotation de ce dataset est terminé.
                Merci beaucoup !
            </Alert></div>;
        case "start":
           return  <Loader mode={LoaderModes.get} text={"Réservation d'élément d'annotation en cours"}/>;
        default:
            return (currentItem != null ? <>
                <ReservationStatus status={reservationStatus}/>
                <AnnotationStatus status={annotationStatus}/>
                <AnnotationsToolbar onPreviousPlaceholder={"Précédent"} onNextPlaceholder={"Suivant"} onNext={onNext}
                                    onPrevious={onPrevious} isPreviousDisabled={!hasPrevious} isNextDisabled={!hasNext}
                                    text={currentItem.fileName}/>
                <AnnotationDispatch expectedOutput={currentItem.annotation.expectedOutput}
                                    annotationType={project.annotationType} labels={project.labels} onSubmit={onSubmit}
                                    url={currentItem.blobUrl} />
            </> : null);
    }};

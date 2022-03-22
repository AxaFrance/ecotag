import {ReservationStatus} from "./ReservationStatus";
import {AnnotationStatus} from "./AnnotationStatus";
import AnnotationsToolbar from "../../../Toolkit/Annotations/AnnotationsToolbar";
import Alert from '@axa-fr/react-toolkit-alert';
import React, {useEffect, useReducer, useState} from "react";
import AnnotationSwitch from "../../../Toolkit/Annotations/AnnotationSwitch";

const AnnotationDispatch = ({ typeAnnotation, labels, url, onSubmit,expectedOutput={} }) => {
    const [state, setState] = useState({blobUrl:null});

    useEffect(async () => {
        setState({blobUrl:null})
        const response = await fetch(url, {method: 'GET'});
        const blob = await response.blob();
        const blobUrl = window.URL.createObjectURL(blob);
        setState({blobUrl})
    }, [url]);

    if(!state.blobUrl){ 
        return null;
    }
    console.log(state.blobUrl)
    return <AnnotationSwitch
        url={state.blobUrl}
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
                                    typeAnnotation={project.annotationType} labels={project.labels} onSubmit={onSubmit}
                                    url={ apiUrl.replace('{path}', `projects/${project.id}/files/${currentItem.fileId}`)} />
            </> : null);
    }};
    

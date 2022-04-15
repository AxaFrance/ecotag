import {ReservationStatus} from "./ReservationStatus";
import {AnnotationStatus} from "./AnnotationStatus";
import AnnotationsToolbar from "../../../Toolkit/Annotations/AnnotationsToolbar";
import Alert from '@axa-fr/react-toolkit-alert';
import React from "react";
import AnnotationSwitch from "../../../Toolkit/Annotations/AnnotationSwitch";
import Loader, {LoaderModes} from '@axa-fr/react-toolkit-loader';
import {annotationItemStatus} from "./Annotation.reducer";

const AnnotationDispatch = ({ annotationType, labels, url, onSubmit,expectedOutput={} }) => {
    return <AnnotationSwitch
        url={url}
        annotationType={annotationType}
        labels ={labels}
        expectedOutput={expectedOutput}
        onSubmit={onSubmit}
    />
};

const getLocale = () => {
    return (navigator.languages && navigator.languages.length) ? navigator.languages[0] : navigator.language;
}

const formatter = () => {
    const locale = getLocale();
    return new Intl.DateTimeFormat(
        locale,
        {
            hour: "numeric",
            minute: "numeric",
            second: "numeric",
        }
    );
}

const getText = (currentItem) =>{
    if(currentItem){
        switch (currentItem.status){
            case annotationItemStatus.ERROR:
                return `${currentItem.fileName} sauvegarde erreur à ${formatter().format(currentItem.statusDate)}`;
            case annotationItemStatus.SAVED:
                return `${currentItem.fileName} sauvegardé à ${formatter().format(currentItem.statusDate)}`;
            case annotationItemStatus.SAVED_PREVIOUS_SESSION:
                return `${currentItem.fileName} sauvegardé lors d'une session précédente}`;
            default:
                return currentItem.fileName;
        }
    }
    return currentItem;
}

export const Content = ({project, currentItem, onSubmit, onNext, onPrevious, hasPrevious, hasNext, documentId, reservationStatus, annotationStatus}) => {
    switch (documentId) {
        case "end":
            return <div className="container"><Alert classModifier="info" title="Annotation">
                Vous avez annoté tout ce que vous pouviez sur ce dataset.
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
                                    text={getText(currentItem)}/>
                <AnnotationDispatch expectedOutput={currentItem.annotation.expectedOutput}
                                    annotationType={project.annotationType} labels={project.labels} onSubmit={onSubmit}
                                    url={currentItem.blobUrl} />
            </> : null);
    }};

import {ReservationStatus} from "./ReservationStatus";
import {AnnotationStatus} from "./AnnotationStatus";
import AnnotationsToolbar from "../../../Toolkit/Annotations/AnnotationsToolbar";
import Alert from '@axa-fr/react-toolkit-alert';
import React from "react";
import AnnotationSwitch from "../../../Toolkit/Annotations/AnnotationSwitch";
import Loader, {LoaderModes} from '@axa-fr/react-toolkit-loader';
import {annotationItemStatus} from "./Annotation.reducer";
import useProjectTranslation from "../../../translations/useProjectTranslation";

const AnnotationDispatch = ({annotationType, labels, url, onSubmit, expectedOutput = {}, filename}) => {
    return <AnnotationSwitch
        url={url}
        annotationType={annotationType}
        labels={labels}
        expectedOutput={expectedOutput}
        filename={filename}
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

export const Content = ({
                            project,
                            currentItem,
                            onSubmit,
                            onNext,
                            onPrevious,
                            hasPrevious,
                            hasNext,
                            documentId,
                            reservationStatus,
                            annotationStatus
                        }) => {

    const {translate} = useProjectTranslation('toolkit');

    const getText = (currentItem) => {
        if (currentItem) {
            switch (currentItem.status) {
                case annotationItemStatus.ERROR:
                    return `${currentItem.fileName} ${translate('content.toolbar.text.error')} ${formatter().format(currentItem.statusDate)}`;
                case annotationItemStatus.SAVED:
                    return `${currentItem.fileName} ${translate('content.toolbar.text.saved')} ${formatter().format(currentItem.statusDate)}`;
                case annotationItemStatus.SAVED_PREVIOUS_SESSION:
                    return `${currentItem.fileName} ${translate('content.toolbar.text.saved_previous_session')}`;
                default:
                    return currentItem.fileName;
            }
        }
        return currentItem;
    }

    switch (documentId) {
        case "end":
            return <div className="container"><Alert classModifier="info" title={translate('content.end.title')}>
                {translate('content.end.text')}
            </Alert></div>;
        case "start":
            return <Loader mode={LoaderModes.get} text={translate('content.start')}/>;
        default:
            return (currentItem != null ? <>
                <ReservationStatus status={reservationStatus}/>
                <AnnotationStatus status={annotationStatus}/>
                <AnnotationsToolbar onPreviousPlaceholder={translate('content.toolbar.previous')} onNextPlaceholder={translate('content.toolbar.next')} onNext={onNext}
                                    onPrevious={onPrevious} isPreviousDisabled={!hasPrevious} isNextDisabled={!hasNext}
                                    text={getText(currentItem)}/>
                <AnnotationDispatch expectedOutput={currentItem.annotation.expectedOutput}
                                    annotationType={project.annotationType} labels={project.labels} onSubmit={onSubmit}
                                    filename={currentItem.fileName}
                                    url={currentItem.blobUrl}/>
            </> : null);
    }
};

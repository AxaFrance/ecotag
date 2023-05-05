import Title from "../../../TitleBar";
import {Content} from "./Content";
import React from "react";
import {withResilience} from "../../shared/Resilience";
import useProjectTranslation from "../../../useProjectTranslation";

export const PageAnnotation = ({
                                   project,
                                   currentItem,
                                   onSubmit,
                                   onNext,
                                   onPrevious,
                                   hasPrevious,
                                   hasNext,
                                   reservationStatus,
                                   documentId,
                                   annotationStatus
                               }) => {
    const {translate} = useProjectTranslation('toolkit');

    return(<>
        <Title title={project.name}
               subtitle={`${translate('page_annotation.subtitle')} ${project.annotationType}`}
               goTo={`/projects/${project.id}`}/>
        <Content reservationStatus={reservationStatus}
                 annotationStatus={annotationStatus}
                 onNext={onNext}
                 onPrevious={onPrevious}
                 project={project}
                 onSubmit={onSubmit}
                 currentItem={currentItem}
                 hasPrevious={hasPrevious}
                 hasNext={hasNext}
                 documentId={documentId}
        />
    </>);
}

export const PageAnnotationWithResilience = withResilience(PageAnnotation);
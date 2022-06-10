import Title from "../../../TitleBar";
import {Content} from "./Content";
import React from "react";
import {withResilience} from "../../shared/Resilience";

export const PageAnnotation = ({project, currentItem, onSubmit, onNext, onPrevious, hasPrevious, hasNext, reservationStatus, documentId, annotationStatus}) => <>
    <Title title={project.name}
           subtitle={`Projet de type ${project.annotationType}`}
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
</>

export const PageAnnotationWithResilience = withResilience(PageAnnotation);
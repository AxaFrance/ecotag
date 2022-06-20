import React from 'react';
import withCustomFetch from '../../withCustomFetch';
import compose from '../../compose';
import withAuthentication from '../../withAuthentication';
import {PageAnnotationWithResilience} from "./PageAnnotation";
import {usePage} from "./Annotation.hook";
import {withEnvironment} from "../../EnvironmentProvider";

export const AnnotationContainer = withEnvironment(({ fetch, environment }) => {
  const { state, currentItem, onSubmit, onNext, onPrevious, hasPrevious, hasNext, documentId } = usePage(fetch, environment);
  return <PageAnnotationWithResilience 
      project={state.project}
      status={state.status} 
      documentId={documentId} 
      currentItem={currentItem} 
      onSubmit={onSubmit} 
      onNext={onNext} 
      onPrevious={onPrevious} 
      hasPrevious={hasPrevious} 
      hasNext={hasNext} 
      reservationStatus={state.annotations.reservationStatus} 
      annotationStatus={state.annotations.annotationStatus}
  />;
});

const enhance = compose(withCustomFetch(fetch), withAuthentication());
export default enhance(AnnotationContainer);

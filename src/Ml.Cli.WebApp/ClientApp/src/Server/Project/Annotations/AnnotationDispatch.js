import React from 'react';
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

export default AnnotationDispatch;

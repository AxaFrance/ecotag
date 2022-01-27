import React from 'react';
import AnnotationSwitch from "../../../Toolkit/Annotations/AnnotationSwitch";


const AnnotationDispatch = ({ project, url, onSubmit }) => {
  const  expectedOutput = {}
  return <AnnotationSwitch
      url={url}
      annotationType={project.typeAnnotation}
      labels ={project.labels}
      expectedOutput={expectedOutput}
      onSubmit={onSubmit}
  />
};

export default AnnotationDispatch;

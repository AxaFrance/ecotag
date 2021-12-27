import React from 'react';
import HandleAnnotation from './HandleAnnotation';


const annotationAction = () => {
  console.log('Mock annotationAction');
};

const onSubmit = () => {
  console.log('mock Submit');
};

const AnnotationDispatch = ({ project }) => {
  switch (project.typeAnnotation) {
    case 'BOUNDING_BOX':
      return (
        <>
        </>
      );
    case 'NER':
      return (
        <>
        </>
      );
    case 'OCR':
      return (
        <>
        </>
      );
    case 'IROT':
      return (
        <>
        </>
      );
    default:
      return (
        <>
        </>
      );
  }
};

export default AnnotationDispatch;

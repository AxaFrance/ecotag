import React from 'react';
import HandleAnnotation from './HandleAnnotation';
import AnnotationSwitch from "../../../Toolkit/Annotations/AnnotationSwitch";


const annotationAction = () => {
  console.log('Mock annotationAction');
};

const onSubmit = () => {
  console.log('mock Submit');
};

const AnnotationDispatch = ({ project }) => {
    const url = "https://d3njjcbhbojbot.cloudfront.net/api/utilities/v1/imageproxy/https://coursera-course-photos.s3.amazonaws.com/b3/b6693cb0424a938c0376ff89bb5f5b/RH_Logo_Whitebg1200x1200.png?auto=format%2Ccompress&dpr=1";
  const  expectedOutput = {}
  return <AnnotationSwitch
      url={url}
      annotationType={project.typeAnnotation}
      labels ={ [{id:"#008194",name:"Firstname",color:"#008194"},{id:"#00ffa2",name:"Lastname",color:"#00ffa2"}]}
      expectedOutput={expectedOutput}
      onSubmit={onSubmit}
  />
};

export default AnnotationDispatch;

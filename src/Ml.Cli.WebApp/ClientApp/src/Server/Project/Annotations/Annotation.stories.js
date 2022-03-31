import React from 'react';
import { AnnotationContainer } from './Annotation.container';
import { MemoryRouter, Route} from "react-router-dom";
import {fetch, expectedOutputJsonOcr} from './mock';

export default {
    title: 'Project/Annotations',
    component: AnnotationContainer
};

const Template = (args) => <MemoryRouter initialEntries={["/projects/0005/start"]}>
    <Route path="/:projectId/0005/:documentId">
        <AnnotationContainer{...args}/>
    </Route>
</MemoryRouter>;

export const Ocr = Template.bind({});
Ocr.args = {
    fetch:fetch("OCR", expectedOutputJsonOcr),
    environment : {apiUrl: "/server/{path}"}
}

export const Cropping = Template.bind({});
Cropping.args = {
    fetch:fetch("Cropping", null),
    environment : {apiUrl: "/server/{path}"}
}

export const ImageClassifier = Template.bind({});
ImageClassifier.args = {
    fetch:fetch("ImageClassifier", null),
    environment : {apiUrl: "/server/{path}"}
}

export const Rotation = Template.bind({});
Rotation.args = {
    fetch:fetch("Rotation", null),
    environment : {apiUrl: "/server/{path}"}
}

export const NamedEntity = Template.bind({});
NamedEntity.args = {
    fetch:fetch("NamedEntity", null),
    environment : {apiUrl: "/server/{path}"}
}
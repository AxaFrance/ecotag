import React from 'react';
import { AnnotationContainer } from './Annotation.container';
import { MemoryRouter, Route} from "react-router-dom";
import {fetch} from './mock';

export default {
    title: 'Project/Annotations',
    component: AnnotationContainer
};

const Template = (args) => <MemoryRouter initialEntries={["/projects/0005/start"]}>
    <Route path="/:projectId/0005/:documentId">
        <AnnotationContainer{...args}/>
    </Route>
</MemoryRouter>;

export const Container = Template.bind({});
Container.args = {
    fetch,
    environment : {apiUrl: "/server/{path}"}
}

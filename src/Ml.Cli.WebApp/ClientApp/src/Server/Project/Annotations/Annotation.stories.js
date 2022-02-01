import React from 'react';
import { AnnotationContainer } from './Annotation.container';
import { BrowserRouter as Router } from 'react-router-dom';

const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

const fetch = async (url, config) => {
    await sleep(1);
    if(config.method === "POST") {
        
    }
    
    return {
        status:status,
        json: async () => {
            await sleep(1);
            return getCallback();
        },
    };
};

export default {
    title: 'Project/Annotations',
    component: AnnotationContainer
};

const Template = (args) => <Router><AnnotationContainer{...args}/></Router>;

export const Container = Template.bind({});
Container.args = {
    fetch
}

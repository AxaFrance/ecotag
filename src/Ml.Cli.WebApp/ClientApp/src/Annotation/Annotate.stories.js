import React from "react";
import Annotate from "./Annotate";
import {HashRouter} from "react-router-dom";

export default {
    title: 'Annotation',
    component: Annotate
};

const mockedFetch = async (queryUrl, data) => Promise.resolve({ok: false, status: 400, statusText: "Bad Request", bodyUsed: false});

const Template = (args) => <HashRouter basename={window.location.pathname}><Annotate {...args} /></HashRouter>;

export const Default = Template.bind({});
Default.args = {
    fetchFunction: mockedFetch
};

Default.parameters = {
    controls: {
        disabled: true
    }
};

import React from "react";
import Gallery from "./Gallery";
import {HashRouter} from "react-router-dom";

export default {
    title: 'Gallery',
    component: Gallery
};

const fetch = () => {};

const Template = (args) => <HashRouter basename={window.location.pathname}><Gallery {...args}/></HashRouter>;

export const Default = Template.bind({});
Default.args = {
    fetchFunction: fetch
};
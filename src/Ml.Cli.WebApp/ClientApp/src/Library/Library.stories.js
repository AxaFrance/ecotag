import React from "react";
import Library from "./Library";

const mockedFunction = () => {};

export default {
    title: 'Library',
    component: Library
};

const Template = (args) => <Library {...args}/>;

export const Default = Template.bind({});
Default.args = {
    type: "",
    files: {},
    analyseLibraryFile: mockedFunction
};
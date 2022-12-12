import React from "react";
import FileLoader from "./FileLoader";

const mockedFunction = () => {
};

export default {
    title: 'FileLoader',
    component: FileLoader
};

const Template = (args) => <FileLoader {...args} />;

export const Default = Template.bind({});
Default.args = {
    id: "fileLoader_id",
    name: "fileLoader_component",
    accept: "application/json",
    onCustomLoad: mockedFunction,
    onFailure: mockedFunction
};

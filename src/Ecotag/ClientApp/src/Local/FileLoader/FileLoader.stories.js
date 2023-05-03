import React from "react";
import FileLoader from "./FileLoader";

const mockedFunction = () => {};
const mockedFetchFunction = () => ({status: 500});

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
    onFailure: mockedFunction,
    fetch: mockedFetchFunction
};

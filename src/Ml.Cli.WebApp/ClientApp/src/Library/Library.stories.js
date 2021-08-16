import React from "react";
import Library from "./Library";

const returnedFiles = ["C:\\someFolder\\compare-licenses-file-1.json",
    "C:\\someFolder\\compare-licenses-file-2.json"];

const mockedFunction = async (queryUrl, data) => Promise.resolve({
    ok: true,
    status: 200,
    json: () => Promise.resolve(returnedFiles)
});

export default {
    title: 'Library',
    component: Library
};

const Template = (args) => <Library {...args}/>;

export const Default = Template.bind({});
Default.args = {
    fetchFunction: mockedFunction
};

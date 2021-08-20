import React from "react";
import Library from "./Library";

const returnedFiles = [
    "C:\\someFolder\\compare-licenses-file-1.json",
    "C:\\someFolder\\compare-licenses-file-2.json",
    "C:\\someFolder\\compare-licenses-file-3.json",
    "C:\\someFolder\\compare-licenses-file-4.json",
    "C:\\someFolder\\compare-licenses-file-5.json",
    "C:\\someFolder\\compare-licenses-file-6.json",
    "C:\\someFolder\\compare-licenses-file-7.json",
    "C:\\someFolder\\compare-licenses-file-8.json",
    "C:\\someFolder\\compare-licenses-file-9.json"
];

const mockedFunction = async (queryUrl, data) => Promise.resolve({
    ok: true,
    status: 200,
    json: () => Promise.resolve(returnedFiles)
});

const noFilesFunction = async (queryUrl, data) => Promise.resolve({
    ok: true,
    status: 200,
    json: () => Promise.resolve([])
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

export const NoFiles = Template.bind({});
NoFiles.args = {
    fetchFunction: noFilesFunction
}
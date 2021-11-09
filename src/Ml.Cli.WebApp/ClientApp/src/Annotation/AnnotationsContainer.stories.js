import AnnotationsContainer from "./AnnotationsContainer";
import React from "react";
import {QueryClient, QueryClientProvider} from "react-query";

const mockedFetchFunction = () => {};

const items = [
    {
        fileName: "first_file",
        id: 0,
        fileDirectory: "fileDirectory",
        imageDirectory: "imageDirectory",
        frontDefaultStringsMatcher: "",
        annotations: {}
    },
    {
        fileName: "second_file",
        id: 1,
        fileDirectory: "fileDirectory",
        imageDirectory: "imageDirectory",
        frontDefaultStringsMatcher: "",
        annotations: {}
    },
    {
        fileName: "third_file",
        id: 2,
        fileDirectory: "fileDirectory",
        imageDirectory: "imageDirectory",
        frontDefaultStringsMatcher: "",
        annotations: {}
    },
    {
        fileName: "fourth_file",
        id: 3,
        fileDirectory: "fileDirectory",
        imageDirectory: "imageDirectory",
        frontDefaultStringsMatcher: "",
        annotations: {}
    }
];

const client = new QueryClient();

export default {
    title: 'AnnotationsContainer',
    component: AnnotationsContainer
};

const Template = (args) => <QueryClientProvider client={client}><AnnotationsContainer {...args}/></QueryClientProvider>;

export const Default = Template.bind({});
Default.args = {
    state: {
        fileName: "dataset-NER.json",
        isFileInserted: true,
        items: items,
        datasetLocation: "datasetLocation",
        annotationType: "NamedEntityRecognition",
        configuration: [{id:"#008194",name:"Firstname",color:"#008194"},{id:"#00ffa2",name:"Lastname",color:"#00ffa2"}]
    },
    entryItem: items[0],
    fetchFunction: mockedFetchFunction
};
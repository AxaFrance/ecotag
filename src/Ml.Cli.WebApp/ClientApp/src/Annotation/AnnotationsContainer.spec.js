import AnnotationsContainer from "./AnnotationsContainer";
import React from "react";
import {fireEvent, render, waitFor} from "@testing-library/react";
import {QueryClient, QueryClientProvider} from "react-query";

const mockedFetchFunction = () => {};
const MonacoEditor = {};

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

const state= {
    fileName: "dataset-NER.json",
    isFileInserted: true,
    items: items,
    datasetLocation: "datasetLocation",
    annotationType: "NamedEntityRecognition",
    configuration: [{id:"#008194",name:"Firstname",color:"#008194"},{id:"#00ffa2",name:"Lastname",color:"#00ffa2"}]
};

const client = new QueryClient();

describe("Should check AnnotationsContainer behaviour", () => {
    test("Should render properly and change items", async () => {
        
        const {container, asFragment, getByText} = render(<QueryClientProvider client={client}><AnnotationsContainer state={state} entryItem={items[0]} fetchFunction={mockedFetchFunction} MonacoEditor={MonacoEditor}/></QueryClientProvider>);
        
        await waitFor(() => expect(container.querySelector(".annotation__top-toolbar")).not.toBeNull());
        await waitFor(() => expect(container.querySelector(".table-result__header")).not.toBeNull());
        expect(asFragment()).toMatchSnapshot();
        
        const nextButton = getByText("Suivant");
        fireEvent.click(nextButton);
        
        await waitFor(() => expect(getByText(/second_file/i)).not.toBeNull());
        expect(asFragment()).toMatchSnapshot();
        
    });
});
import React from "react";
import {render, waitFor} from '@testing-library/react';
import AnnotationsContainer from "./AnnotationsContainer";
import {QueryClient, QueryClientProvider} from "react-query";

const fetch = () => {return {status: 400, ok: false}};

const client = new QueryClient();

const state = {
    datasetLocation: "datasetLocation",
    annotationType: "NamedEntityRecognition",
    items: [{
        filename: "filename.json",
        fileDirectory: "fileDirectory",
        imageDirectory: "",
        frontDefaultStringsMatcher: "",
        annotations: "",
        id: 1
    }],
    configuration: [{
        color: "#008194",
        id: "1",
        "name": "Firstname"
    }]
};

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

describe("Should check AnnotationsContainer component behaviour", () => {
    test("Should display annotation", async () => {
        const {container, asFragment} = render(<QueryClientProvider client={client}><AnnotationsContainer state={state} id={1} dataset="someDataset" url="someUrl" fetchFunction={fetch}/></QueryClientProvider>);
        
        expect(asFragment()).toMatchSnapshot();
        
        //necessary to force a longer waitFor
        await sleep(3000);
        await waitFor(() => expect(container.querySelector(".tokenAnnotation-container")).not.toBeNull());
        
        expect(asFragment()).toMatchSnapshot();
    })
})
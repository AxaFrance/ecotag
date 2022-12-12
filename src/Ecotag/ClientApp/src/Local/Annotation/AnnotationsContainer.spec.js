import React from "react";
import {render, waitFor} from '@testing-library/react';
import AnnotationsContainer from "./AnnotationsContainer";
import {QueryClient, QueryClientProvider} from "react-query";

const fetch = () => {
    return {status: 400, ok: false}
};

const client = new QueryClient();

const state = {
    datasetLocation: "datasetLocation",
    annotationType: "ImageClassifier",
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
        const {container, asFragment, getByText} = render(<QueryClientProvider client={client}><AnnotationsContainer
            state={state} id={1} dataset="someDataset" url="someUrl" fetch={fetch}/></QueryClientProvider>);

        expect(asFragment()).toMatchSnapshot();
        let label = await waitFor(() => getByText('Firstname'));
        expect(label).not.toBeNull();

        expect(asFragment()).toMatchSnapshot();
    })
})
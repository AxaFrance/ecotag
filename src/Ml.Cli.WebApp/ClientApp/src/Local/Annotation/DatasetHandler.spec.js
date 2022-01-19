import React from "react";
import DatasetHandler from "./DatasetHandler";
import {fireEvent, render, waitFor} from '@testing-library/react';

const mockHistoryPush = jest.fn();

jest.mock('react-router', () => ({
    ...jest.requireActual('react-router'),
    useHistory: () => ({
        push: mockHistoryPush
    })
}));

const dataSource = (`{"DatasetLocation": "..\\\\..\\\\demo\\\\licenses\\\\datasets\\\\dataset-ner.json", "AnnotationType": "NamedEntityRecognition", "Configuration": "[{\\\"id\\\": \\\"#008194\\\", \\\"name\\\":\\\"Firstname\\\", \\\"color\\\":\\\"#008194\\\"}]", "Content":[{\"FileName\": \"filename.json\", \"FileDirectory\": \"fileDirectory\", \"ImageDirectory\": \"\", \"FrontDefaultStringsMatcher\": \"\", \"Annotations\":\"\"}]}`);

const fetch = () => { return {status: 400, ok: false}};

let state = {
    fileName: "",
    datasetLocation: "",
    annotationType: "JsonEditor",
    configuration: "",
    items: [],
    isFileInserted: false
};

const setState = (args) => {
    state = {...args};
}

describe("Check DatasetHandler component behaviour,",() => {
    test("Should  map items correctly", async () => {
        const {container, asFragment} = render(<DatasetHandler state={state} setState={setState} fetchFunction={fetch}/>);
        
        expect(asFragment()).toMatchSnapshot();

        const blob = new Blob([dataSource], {type: "text/plain;charset=utf-8"});
        const fileSource = new File([blob], "dataSourceFile.json", {type: "application/json"});
        const fileInput = container.querySelector("input[type='file']");
        fireEvent.change(fileInput, {target: {files: [fileSource]}});
        
        await waitFor(() => expect(state.isFileInserted).toEqual(true));
        
        expect(state.items).not.toBeNull();
        delete state.items[0].id;
        
        expect(state).toEqual({
            fileName: "dataSourceFile.json",
            datasetLocation: "..\\..\\demo\\licenses\\datasets\\dataset-ner.json",
            annotationType: "NamedEntityRecognition",
            configuration: [{"color": "#008194", "id": "#008194", "name": "Firstname"}],
            items: [{
                "fileDirectory": "fileDirectory",
                "fileName": "filename.json",
                "imageDirectory": "",
                "frontDefaultStringsMatcher": "",
                "annotations": ""
            }],
            isFileInserted: true
        });
    })
})
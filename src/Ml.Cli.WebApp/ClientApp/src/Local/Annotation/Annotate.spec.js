import React from "react";
import {fireEvent, render, waitFor} from '@testing-library/react';
import DatasetHandler from "./DatasetHandler";

const mockHistoryPush = jest.fn();

jest.mock('react-router', () => ({
    ...jest.requireActual('react-router'),
    useHistory: () => ({
        push: mockHistoryPush
    })
}));

const mockedFetchFunction = () => {
    return {
        ok: false,
        status: 400,
        json: () => Promise.resolve([])
    };
};

const dataSource = (`{"DatasetLocation": "C:\\\\location", "AnnotationType": "ImageClassifier", "Configuration": "[{\\\"name\\\": \\\"Dog\\\"}, {\\\"name\\\": \\\"Cat\\\"}, {\\\"name\\\": \\\"Other\\\"}]", "Content": [{\"FileName\": \"filename.json\",\"FileDirectory\": \"fileDirectory\",\"ImageDirectory\": \"imageDirectory\",\"FrontDefaultStringsMatcher\": \"\",\"Annotations\": \"\"}]}`);

describe("Check annotation tab behaviour", () => {
    test("Should insert dataset and update name", async () => {
        let state = {
            fileName: "Annotate a dataset",
            datasetLocation: "",
            items: [],
            annotationType: "JsonEditor",
            configuration: [{name: "Default", id: 0}],
            isFileInserted: false
        };
        const setState = (params) => {
            state = params;
        };
        const {container, asFragment} = render(<DatasetHandler state={state} setState={setState} fetchFunction={mockedFetchFunction}/>);

        expect(asFragment()).toMatchSnapshot();

        const blob = new Blob([dataSource], {type: "text/plain;charset=utf-8"});
        const fileSource = new File([blob], "dataSourceFile.json", {type: "application/json"});
        const fileInput = container.querySelector("input[type='file']");
        
        fireEvent.change(fileInput, {target: {files: [fileSource]}});
        
        await waitFor(() => expect(state.fileName).toEqual("dataSourceFile.json"));
        
        state.items.forEach(item => delete item.id);    //usage of cuid would make state.items unpredictable
        
        expect(state.items).toEqual([{"annotations": "", "fileDirectory": "fileDirectory", "fileName": "filename.json", "frontDefaultStringsMatcher": "", "imageDirectory": "imageDirectory"}]);
    });
});
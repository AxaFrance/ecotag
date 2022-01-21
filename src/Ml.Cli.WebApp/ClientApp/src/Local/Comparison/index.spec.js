import React from "react";
import '@testing-library/jest-dom';
import {fireEvent, render, waitFor} from '@testing-library/react';
import Compare from "./Compare";
import {BrowserRouter} from "react-router-dom";

const dataSource = (`{"CompareLocation": "C:\\\\location", "Content": [{\"FileName\": \"{FileName}_pdf.json\",\"Left\": {\"Url\": \"https://url\",\"FileName\": \"{FileName}.pdf\",\"FileDirectory\": \"fileDirectoryValue\",\"StatusCode\": 200,\"Body\": \"[{\\\"firstname\\\": \\\"JOHN\\\", \\\"lastname\\\": \\\"DOE\\\", \\\"birthdate\\\": \\\"2021-02-02\\\", \\\"categoryB\\\": \\\"categoryB_value\\\"}]\",\"Headers\": [],\"TimeMs\": 0,\"TicksAt\": 0},\"Right\": {\"Url\": \"https://url\",\"FileName\": \"{FileName}.pdf\",\"FileDirectory\": \"fileDirectoryValue\",\"StatusCode\": 200,\"Body\": \"[{\\\"firstname\\\":\\\"JOHN\\\",\\\"lastname\\\":\\\"DOE\\\",\\\"birthdate\\\":\\\"\\\",\\\"categoryB\\\":null}]\",\"Headers\": [],\"TimeMs\": 28292,\"TicksAt\": 637466461265041729}}]}`);

const fetch = async (queryUrl, data) => Promise.resolve({
    ok: false,
    status: 400
});

describe('Check a compare file insertion', () => {
    test('Find table result of KOs after file input and change select state to All', async () => {
        const MonacoEditor = React.lazy(() => import("@monaco-editor/react"));
        const {container, asFragment, getAllByText} = render(<BrowserRouter><Compare MonacoEditor={MonacoEditor} fetch={fetch}/></BrowserRouter>);

        const blob = new Blob([dataSource], {type: "text/plain;charset=utf-8"});
        const fileSource = new File([blob], "dataSourceFile.json", {type: "application/json"});
        const fileInput = container.querySelector("input[type='file']");

        fireEvent.change(fileInput, {target: {files: [fileSource]}});

        await waitFor(() => expect(container.querySelector('.table-result')).not.toBeNull());
        expect(asFragment()).toMatchSnapshot();

        const selectState = container.querySelector("select[id='select_type']");

        fireEvent.change(selectState, {target: {value: "All"}});
        
        const submitButton = container.querySelector(`[id='submit-btn']`);
        
        fireEvent.click(submitButton);

        await waitFor(() => expect(getAllByText(/JOHN/i)).not.toBeNull());
        
        const selectExtension = container.querySelector("select[id='extension_type']");
        
        fireEvent.change(selectExtension, {target: {value: "TIFF"}});
        
        fireEvent.click(submitButton);
        
        await waitFor(() => expect(getAllByText(/related/i)).not.toBeNull());
        
        expect(asFragment()).toMatchSnapshot();

    });
});

import React from "react";
import {fireEvent, render, waitFor} from "@testing-library/react";
import Annotate from "./Annotate";

const dataset = (`{"DatasetLocation": "C:\\\\location", "Content": [{\"FileName\": \"{FileName}_pdf.json\",\"FileDirectory\": \"fileDirectoryValue\",\"ImageDirectory\": \"imageDirectoryValue\",\"Annotations\":{}}]}`);

describe("Check dataset handling", () => {
    test("Should insert dataset", async () => {
        const mockedMonacoEditor = () => (<div>This is a mocked Monaco Editor</div>);
        const {container, asFragment, getAllByText} = render(<Annotate MonacoEditor={mockedMonacoEditor}/>);

        const blob = new Blob([dataset], {type: "text/plain;charset=utf-8"});
        const fileSource = new File([blob], "dataSourceFile.json", {type: "application/json"});
        const fileInput = container.querySelector("input[type='file']");
        fireEvent.change(fileInput, {target: {files: [fileSource]}});

        await waitFor(() => expect(container.querySelector('.table-result')).not.toBeNull());
        await waitFor(() => expect(getAllByText(/Fichier en cours de visualisation : dataSourceFile.json/i)).not.toBeNull());
        expect(asFragment()).toMatchSnapshot();
    });
});

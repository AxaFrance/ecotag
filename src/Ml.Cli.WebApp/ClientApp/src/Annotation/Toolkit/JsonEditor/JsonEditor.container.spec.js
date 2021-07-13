import React from "react";
import {render, waitFor, fireEvent} from '@testing-library/react';
import {Textarea} from "@axa-fr/react-toolkit-form-input-textarea";
import JsonEditorContainer from "./JsonEditor.container";

const expectedResult = {};

const mockedMonacoEditor = ({id, height, language, value, onChange, options}) => {
    return (
        <Textarea
            id={id}
            name="Textarea"
            value={value}
            onChange={onChange}
        />
    );
};

describe('Check Editor usage', () => {
    test('Change Editor content', async () => {

        let hasBeenClicked = false;

        const {container, asFragment, getAllByText} = render(
            <JsonEditorContainer
                expectedOutput={{
                    id: "Editor-container-test",
                    fileName: "fileName_value",
                    value: "{\"analysis\": \"This is a test\"}"
                }}
                urls={[]}
                onSubmit={() => hasBeenClicked = true}
                MonacoEditor={mockedMonacoEditor}
            />
        );
        await waitFor(() => expect(getAllByText(/Aucun fichier correspondant n'a été trouvé sur votre disque./i)).not.toBeNull());
        const fileInput = container.querySelector("#Editor-container-test");
        expect(fileInput).toHaveTextContent("{ \"analysis\": \"This is a test\" }");
        const saveButton = container.querySelector(".btn.af-btn");
        fireEvent.click(saveButton);
        expect(hasBeenClicked).toEqual(true);
        expect(asFragment()).toMatchSnapshot();
    });
});

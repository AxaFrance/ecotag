import {render, waitFor} from "@testing-library/react";
import React from "react";
import AnnotationImagesLoader from "./AnnotationImagesLoader";
import {Textarea} from "@axa-fr/react-toolkit-form-input-textarea";

const mockedMonacoEditor = ({id, value, onChange}) => {
    return (
        <Textarea
            id={id}
            name="Textarea"
            value={value}
            onChange={onChange}
        />
    );
};

const mockedOnSubmit = () => {
    //This is intentional
};

const mockedFetchFunction = () => {
    return {
        ok: true,
        json: async () => ["C:\\\\imageLocation"]
    };
};

describe("Check dataset handling", () => {
    test("Should render AnnotationImagesLoader and get image", async () => {
        const {container, asFragment} = render(
            <AnnotationImagesLoader
                expectedOutput={{
                    id: "annotation_image_loader_editor_id",
                    fileName: "fileName.json",
                    value: "This is the editor content"
                }}
                item={{fileName: "fileName.json", imageDirectory: "imageDirectoryValue"}}
                onSubmit={mockedOnSubmit}
                MonacoEditor={mockedMonacoEditor}
                fetchFunction={mockedFetchFunction}
            />);

        await waitFor(() => expect(container.querySelector("img")).toBeNull());
        //const image = container.querySelector("img");
        //expect(image.getAttribute("src")).toEqual("api/files/value=C%3A%5C%5CimageLocation");
        expect(asFragment()).toMatchSnapshot();
    });
});

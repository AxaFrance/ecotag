import {render, waitFor} from "@testing-library/react";
import React from "react";
import AnnotationImagesLoader from "./AnnotationImagesLoader";
import {Textarea} from "@axa-fr/react-toolkit-form-input-textarea";
import {QueryClient, QueryClientProvider} from "react-query";

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
        status: 200,
        json: async () => ["C:\\\\imageLocation"]
    };
};

describe("Check dataset handling", () => {
    test("Should render AnnotationImagesLoader and get image", async () => {
        const queryClient = new QueryClient();
        const configuration = JSON.parse("[{\"name\": \"Recto\", \"id\": 0}, {\"name\": \"Verso\", \"id\": 1}]");
        const {container, asFragment} = render(
            <QueryClientProvider client={queryClient}>
                <AnnotationImagesLoader
                    expectedOutput={{
                        id: "annotation_image_loader_editor_id",
                        fileName: "fileName.json",
                        value: "This is the editor content"
                    }}
                    item={{fileName: "fileName.json", imageDirectory: "imageDirectoryValue"}}
                    onSubmit={mockedOnSubmit}
                    MonacoEditor={mockedMonacoEditor}
                    parentState={{configuration, annotationType: "Ocr"}}
                    fetchFunction={mockedFetchFunction}
                />
            </QueryClientProvider>
        );

        //await waitFor(() => expect(container.querySelector("img")).toBeNull());
        const image = container.querySelector("img");
        await waitFor(() => expect(image.getAttribute("src")).toEqual("api/files/value=C%3A%5C%5CimageLocation"));
        expect(asFragment()).toMatchSnapshot();
    });
});

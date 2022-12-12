import React from "react";
import {fireEvent, render, waitFor} from '@testing-library/react';
import url from './sample_image.png';
import ImageClassifierContainer from "./ImageClassifier.container";

const labels = [{name: "Dog"}, {name: "Cat"}, {name: "Duck"}, {name: "Other"}];

describe("Check Image Classifier behaviour", () => {
    test("Should render correctly and click on button", async () => {

        let selectedValue = "";

        const {container, getByText, asFragment} = render(
            <ImageClassifierContainer
                url={url}
                labels={labels}
                onSubmit={(e) => selectedValue = e}
            />
        )
        await waitFor(() => expect(container.querySelector(".image-classifier__buttons-container")).not.toBeNull());
        expect(asFragment()).toMatchSnapshot();

        const buttonsNumber = container.querySelectorAll(".image-classifier-btn");

        expect(buttonsNumber.length).toEqual(4);

        const selectedButton = getByText("Cat");
        fireEvent.click(selectedButton);

        expect(selectedValue).toEqual("Cat");
    });
});
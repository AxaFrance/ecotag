import ImageClassifier from "./ImageClassifier";
import React from "react";
import {render, waitFor, fireEvent} from '@testing-library/react';

const labels = [{name: "Dog"}, {name: "Cat"}, {name: "Duck"}, {name: "Other"}];
import url from './sample_image.png';

describe("Check Image Classifier behaviour", () => {
   test("Should render correctly and click on button", async () => {
       
       let selectedValue = "";
       
       const {container, getByText, asFragment} = render(
           <ImageClassifier
               url={url}
               labels={labels}
               onSubmit={(e) => selectedValue = e}
           />
       )
       await waitFor(() => expect(container.querySelector(".image-classifier__buttons-container")).not.toBeNull());
       expect(asFragment()).toMatchSnapshot();
       
       const buttonsNumber = container.querySelectorAll(".af-btn");
       
       expect(buttonsNumber.length).toEqual(4);
       
       const selectedButton = getByText("Cat");
       fireEvent.click(selectedButton);
       
       expect(selectedValue).toEqual("Cat");
   }) ;
});
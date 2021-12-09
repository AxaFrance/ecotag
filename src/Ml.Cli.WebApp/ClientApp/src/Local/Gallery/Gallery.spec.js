import Gallery from "./Gallery";
import {fireEvent, render, waitFor} from '@testing-library/react';
import React from "react";
import {BrowserRouter as Router} from "react-router-dom";

const returnedFiles =  [
    {date: "2021-07-02T17:07:15.0575353+02:00", file: "C:\\someFolder\\compare-licenses-file-1.json"},
    {date: "2021-08-02T17:07:15.0575353+02:00", file: "C:\\someFolder\\compare-licenses-file-2.json"},
    {date: "2021-09-02T17:07:15.0575353+02:00", file: "C:\\someFolder\\someImage.png"},
    {date: "2021-10-02T17:07:15.0575353+02:00", file: "C:\\someFolder\\somePdf.pdf"}
];

const mockedFetchFunction = () => {
    return {
        ok: true,
        status: 200,
        json: () => Promise.resolve(returnedFiles)
    };
};

describe('Check images display', () => {
    test('Should render Gallery page correctly', async () => {
        const {container, asFragment} = render(<Router basename="/"><Gallery fetchFunction={mockedFetchFunction} /></Router>);
        
        expect(asFragment()).toMatchSnapshot();
        
        const fileTextArea = container.querySelector(".af-form__input-text");
        fireEvent.change(fileTextArea, {target: {value: "C:\\someFolder"}});
        
        const submitButton = container.querySelector(".btn.af-btn");
        fireEvent.click(submitButton);
        
        await waitFor(() => expect(container.querySelector('.image-gallery__link')).not.toBeNull());
        expect(asFragment()).toMatchSnapshot();
    });
});

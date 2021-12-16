import Gallery from "./Gallery";
import {fireEvent, render, waitFor} from '@testing-library/react';
import React from "react";
import {BrowserRouter as Router} from "react-router-dom";

jest.setTimeout(10000);

const returnedFiles =  [
    {date: "2021-07-02T17:07:15.0575353+02:00", file: "C:\\someFolder\\compare-licenses-file-1.json"},
    {date: "2021-08-02T17:07:15.0575353+02:00", file: "C:\\someFolder\\compare-licenses-file-2.json"},
    {date: "2021-09-02T17:07:15.0575353+02:00", file: "C:\\someFolder\\someImage.png"},
    {date: "2021-10-02T17:07:15.0575353+02:00", file: "C:\\someFolder\\somePdf.pdf"}
];

let nbFetchCalls = 0;

const mockedFetchFunction = () => {
    nbFetchCalls++;
    return {
        ok: true,
        status: 200,
        json: () => Promise.resolve(returnedFiles)
    };
};

const mockedFetchFunctionKO = () => {
    return {ok: false, status: 400, json: () => Promise.resolve([])};
}

describe('Check images display', () => {
    test('Should render Gallery page correctly and sort dates', async () => {
        const {container, asFragment} = render(<Router basename="/"><Gallery fetchFunction={mockedFetchFunction} /></Router>);
        
        expect(asFragment()).toMatchSnapshot();
        
        const fileTextArea = container.querySelector(".af-form__input-text");
        fireEvent.change(fileTextArea, {target: {value: "C:\\someFolder"}});
        
        const submitButton = container.querySelector(".btn.af-btn");
        fireEvent.click(submitButton);
        
        await waitFor(() => expect(container.querySelector('.image-gallery__link')).not.toBeNull());
        expect(asFragment()).toMatchSnapshot();
        
        const sizeSelect = container.querySelector("#select_type_size");
        fireEvent.change(sizeSelect, {target: {value: "256px"}});
        
        fireEvent.click(submitButton);
        
        await waitFor(() => expect(container.querySelector('.image-container-width__normal')).not.toBeNull());
        
        await new Promise((r) => setTimeout(r, 6000));
        await waitFor(() => expect(nbFetchCalls).toBeGreaterThanOrEqual(3));

        expect(asFragment()).toMatchSnapshot();
    });
    
    test('Should handle error on bad request', async () => {
        const {container, asFragment} = render(<Router basename="/"><Gallery fetchFunction={mockedFetchFunctionKO} /></Router>);

        expect(asFragment()).toMatchSnapshot();

        const fileTextArea = container.querySelector(".af-form__input-text");
        fireEvent.change(fileTextArea, {target: {value: "C:\\someFolder"}});

        const submitButton = container.querySelector(".btn.af-btn");
        fireEvent.click(submitButton);
        
        await waitFor(() => expect(container.querySelector('.gallery__error-message')).not.toBeNull());
        expect(asFragment()).toMatchSnapshot();
    })
});

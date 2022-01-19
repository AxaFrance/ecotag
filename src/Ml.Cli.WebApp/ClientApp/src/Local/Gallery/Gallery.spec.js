import Gallery, {sortItems} from "./Gallery";
import {act, fireEvent, render, waitFor} from '@testing-library/react';
import React from "react";
import {BrowserRouter as Router} from "react-router-dom";

jest.setTimeout(10000);

const returnedFiles =  [
    {date: "2021-07-02T17:07:15.0575353+02:00", file: "C:\\someFolder\\compare-licenses-file-1.json"},
    {date: "2021-08-02T17:07:15.0575353+02:00", file: "C:\\someFolder\\compare-licenses-file-2.json"},
    {date: "2021-09-02T17:07:15.0575353+02:00", file: "C:\\someFolder\\someImage.png"},
    {date: "2021-10-02T17:07:15.0575353+02:00", file: "C:\\someFolder\\somePdf.pdf"}
];

const sortFiles = [
    {date: "2021-07-02T17:07:15.0575353+02:00", name: "C:\\someFolder\\compare-licenses-file-1.json"},
    {date: "2021-08-02T17:07:15.0575353+02:00", name: "C:\\someFolder\\compare-licenses-file-2.json"},
    {date: "2021-09-02T17:07:15.0575353+02:00", name: "C:\\someFolder\\someImage.png"},
    {date: "2021-10-02T17:07:15.0575353+02:00", name: "C:\\someFolder\\somePdf.pdf"}
]

let nbFetchCalls = 0;

const fetch = () => {
    nbFetchCalls++;
    return {
        ok: true,
        status: 200,
        json: () => Promise.resolve(returnedFiles)
    };
};

const fetchKO = () => {
    return {ok: false, status: 400, json: () => Promise.resolve([])};
}

describe('Check images display', () => {
    test('Should render Gallery page correctly, resize images and sort by names', async () => {
        const {container, asFragment} = render(<Router basename="/"><Gallery fetchFunction={fetch} /></Router>);
        
        expect(asFragment()).toMatchSnapshot();
        
        const fileTextArea = container.querySelector(".af-form__input-text");
        fireEvent.change(fileTextArea, {target: {value: "C:\\someFolder"}});
        
        const submitButton = container.querySelector(".btn.af-btn");
        fireEvent.click(submitButton);
        
        await waitFor(() => expect(container.querySelector('.image-gallery__link')).not.toBeNull());
        expect(asFragment()).toMatchSnapshot();
        
        const sizeSelect = container.querySelector("#select_type_size");
        const namesSelect = container.querySelector("#select_type_sort");
        fireEvent.change(sizeSelect, {target: {value: "256px"}});
        fireEvent.change(namesSelect, {target: {value: "Alphabetic asc"}});
        
        fireEvent.click(submitButton);
        
        await waitFor(() => expect(container.querySelector('.image-container-width__normal')).not.toBeNull());
        
        await act(async() => new Promise((r) => setTimeout(r, 6000)));
        await waitFor(() => expect(nbFetchCalls).toBeGreaterThanOrEqual(3));

        expect(asFragment()).toMatchSnapshot();
    });
    
    test('Should handle error on bad request', async () => {
        const {container, asFragment} = render(<Router basename="/"><Gallery fetchFunction={fetchKO} /></Router>);

        expect(asFragment()).toMatchSnapshot();

        const fileTextArea = container.querySelector(".af-form__input-text");
        fireEvent.change(fileTextArea, {target: {value: "C:\\someFolder"}});

        const submitButton = container.querySelector(".btn.af-btn");
        fireEvent.click(submitButton);
        
        await waitFor(() => expect(container.querySelector('.gallery__error-message')).not.toBeNull());
        expect(asFragment()).toMatchSnapshot();
    });
});

describe.each([
    {sortName: "Recent to old", files: sortFiles, expected: [sortFiles[3], sortFiles[2], sortFiles[1], sortFiles[0]]},
    {sortName: "Old to recent", files: sortFiles, expected: sortFiles},
    {sortName: "Alphabetic asc", files: sortFiles, expected: sortFiles},
    {sortName: "Alphabetic desc", files: sortFiles, expected: [sortFiles[3], sortFiles[2], sortFiles[1], sortFiles[0]]}
])("Check files sorting order", ({sortName, files, expected}) =>  {
    test(`Sort by order: ${sortName}`, () => {
        const result = sortItems(sortName, files);
        expect(result).toEqual(expected);
    });
});
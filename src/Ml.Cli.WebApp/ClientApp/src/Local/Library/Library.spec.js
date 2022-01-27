import React from "react";
import Library from "./Library";
import {render, waitFor} from '@testing-library/react';

const returnedFiles = [
    "C:\\someFolder\\compare-licenses-file-1.json",
    "C:\\someFolder\\compare-licenses-file-2.json",
    "C:\\someFolder\\compare-licenses-file-3.json",
    "C:\\someFolder\\compare-licenses-file-4.json",
    "C:\\someFolder\\compare-licenses-file-5.json",
    "C:\\someFolder\\compare-licenses-file-6.json",
    "C:\\someFolder\\compare-licenses-file-7.json",
    "C:\\someFolder\\compare-licenses-file-8.json",
    "C:\\someFolder\\compare-licenses-file-9.json"
];

const onPlayClick = () => {};

const fetch = async (queryUrl, data) => Promise.resolve({
    ok: false,
    status: 400
});

const fetchWithFiles = async (queryUrl, data) => Promise.resolve({
    ok: true,
    status: 200,
    json: () => Promise.resolve(returnedFiles)
});

describe('Check Library component behavior and display', () => {
    test('Should have correct display when no files found', async () => {
        const {container, asFragment} = render(<Library onPlayClick={onPlayClick} fetch={fetch}/>);
        await waitFor(() => expect(container.querySelector('.library__container')).not.toBeNull());
        expect(asFragment()).toMatchSnapshot();
    });
    test('Should have correct display when files found', async () => {
        const {container, asFragment} = render(<Library onPlayClick={onPlayClick}
                                                        fetch={fetchWithFiles}/>);
        await waitFor(() => expect(container.querySelector('.library__container')).not.toBeNull());
        expect(asFragment()).toMatchSnapshot();
    })
});

import '@testing-library/jest-dom';
import {render, fireEvent, screen, waitFor} from '@testing-library/react';
import React from "react";
import url from "./sample_image.png";
import OcrContainer from "./Ocr.container";

const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

const onSubmit = jest.fn(async data => {
    console.log(data);
    await sleep(20);
});

const expectedLabels = [];
const labels =   [{name: "Recto", color: "#212121", id: 0},
    {name: "Verso", color: "#ffbb00", id: 1},
    {name: "Signature", color: "#f20713", id: 2}];

describe(`Annotation.Irot`, () => {
    test(`should return correct values`, async () => {
        const { container } = render(<OcrContainer labels={labels} expectedLabels={expectedLabels} url={url} onSubmit={onSubmit} />);

        await waitFor(() => {
            const input = container.querySelector('[name="Recto"]');
            fireEvent.change(input, {
                target: { value: "youhou" },
            });
        });

        await waitFor(() => {
            const item = screen.queryByText("Submit");
            fireEvent.click(item);
        });

        await waitFor(() => {
            const output = onSubmit.mock.calls[0][0];
            expect(output).toEqual({
                labels: {
                    Recto: "youhou"
                },
                width: 0,
                height: 0,
                type: 'png'
            });
        });

    });

    test(`should set expected value and return correct values`, async () => {
        const expectedLabels = ["youhou"];
        const labels =   [{name: "0", color: "#212121", id: 0},
            {name: "1", color: "#ffbb00", id: 1},
            {name: "2", color: "#f20713", id: 2}];
        render(<OcrContainer labels={labels} expectedLabels={expectedLabels} url={url} onSubmit={onSubmit} />);

        await waitFor(() => {
            const item = screen.queryByText("Submit");
            fireEvent.click(item);
        });

        await waitFor(() => {
            const output = onSubmit.mock.calls[0][0];
            expect(output).toEqual({
                labels: {
                    "0": "youhou",
                    "1": "",
                    "2": ""
                },
                width: 0,
                height: 0,
                type: 'png'
            });
        });

    });
});

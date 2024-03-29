import IrotContainer from "./Irot.container";
import '@testing-library/jest-dom';
import {fireEvent, render, screen, waitFor} from '@testing-library/react';
import React from "react";
import url1 from "./sample_image.png";
import url2 from "./marches-competences.jpg";

const sleep = ms => new Promise(resolve => setTimeout(resolve, ms));

const onSubmit = jest.fn(async data => {
    console.log(data);
    await sleep(20);
});

const expectedOutput = {
    labels: {"angle": -30},
    image_anomaly: false
};

const defaultImageDimensions = {height: 400, width: 512};

describe(`Annotation.Irot`, () => {
    test(`should return correct values`, async () => {
        const {container, rerender} = render(<IrotContainer url={url1} onSubmit={onSubmit}
                                                            expectedOutput={expectedOutput}
                                                            defaultImageDimensions={defaultImageDimensions}/>);

        await waitFor(() => {
            const input = container.querySelector('[id="angle"]');
            fireEvent.change(input, {
                target: {value: -80},
            });
        });

        const fireSumbit = () => {
            const item = screen.queryByText("Submit");
            fireEvent.click(item);
        };
        const fireReset = () => {
            const item = screen.queryByText("Reset");
            fireEvent.click(item);
        };

        const fireAnomaly = () => {
            const item = container.querySelector('[id="anomaly"]')
            fireEvent.click(item)
        }

        await waitFor(() => {
            fireSumbit();
        });

        await waitFor(() => {
            const output = onSubmit.mock.calls[0][0];
            expect(output).toEqual({
                labels: {
                    angle: -80
                },
                image_anomaly: false,
                width: 512,
                height: 400,
                type: 'png'
            });
        });

        await waitFor(() => {
            fireReset();
        });

        await waitFor(() => {
            fireSumbit();
        });

        await waitFor(() => {
            const output = onSubmit.mock.calls[1][0];
            expect(output).toEqual({
                labels: {
                    angle: -30
                },
                image_anomaly: false,
                width: 512,
                height: 400,
                type: 'png'
            });
        });

        rerender(<IrotContainer url={url2} onSubmit={onSubmit} expectedOutput={null}
                                defaultImageDimensions={defaultImageDimensions}/>);

        await waitFor(() => {
            fireSumbit();
        });

        await waitFor(() => {
            const output = onSubmit.mock.calls[2][0];
            expect(output).toEqual({
                labels: {
                    angle: 0
                },
                image_anomaly: false,
                width: 512,
                height: 400,
                type: 'jpg'
            });
        });

        rerender(<IrotContainer url={url2} onSubmit={onSubmit} expectedLabels={null}
                                defaultImageDimensions={defaultImageDimensions}/>);

        await waitFor(() => {
            fireAnomaly();
        });
        await waitFor(() => {
            fireSumbit();
        });
        const output = onSubmit.mock.calls[3][0];
        expect(output).toEqual({
            labels: {
                angle: 0
            },
            image_anomaly: true,
            width: 512,
            height: 400,
            type: 'jpg'
        },)

        rerender(<IrotContainer url={url1} onSubmit={onSubmit} expectedLabels={null}
                                defaultImageDimensions={defaultImageDimensions}/>);
        const checkboxAnomaly = document.getElementById("anomaly").checked;
        expect(checkboxAnomaly).toEqual(false);
    });
});

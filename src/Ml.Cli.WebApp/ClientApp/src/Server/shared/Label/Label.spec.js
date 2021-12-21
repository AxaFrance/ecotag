import '@testing-library/jest-dom';
import { render, waitFor } from '@testing-library/react';
import React from "react";
import LabelContainer from './Label.js';
import {fireEvent} from "@testing-library/dom";

const currentLabels = [{name: "recto", id: 1, color: "#212121"}];

const onChange = e => {
    console.log(e)
};

describe(`Labels component`, () => {
    test(`should return correct values`, async () => {
        const { container } = render(<LabelContainer name="recto" id="1" values={currentLabels} onChange={onChange}/>);
        const labelListContainer = container.querySelector('div[class="ft-label__label-list"]');

        await waitFor(() => {
            expect(labelListContainer.children.length === 1);
        })

        await waitFor(() => {
            const inputLabel = container.querySelector('input[class="af-form__input-text"]');
            const validateButton = container.querySelector('button[class="af-btn--circle ft-label__validate-button"]');
            fireEvent.change(inputLabel,  { target: { value: 'verso' } });
            fireEvent.click(validateButton);
        });

        await waitFor (() => {
            expect(labelListContainer.children.length === 2);
        });

        await waitFor (() => {
            const deleteButton = labelListContainer.children[0].querySelector('button[class="ft-label__side-button ft-label__side-button--delete"]')
            fireEvent.click(deleteButton);
            expect(labelListContainer.children.length === 1);
        });
    });
});

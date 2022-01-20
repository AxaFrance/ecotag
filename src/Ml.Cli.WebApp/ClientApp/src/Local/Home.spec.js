import React from "react";
import '@testing-library/jest-dom';
import {fireEvent, render, waitFor} from '@testing-library/react';
import { Routes } from "./Routes";
import {BrowserRouter as Router} from "react-router-dom";

const fetch = async (queryUrl, data) => Promise.resolve({
    ok: false,
    status: 400
});

describe('Check page shifting', () => {
    test('Render home page and go to compare page', async () => {
        const { container, asFragment  } = render(<Router basename="/"><Routes fetch={fetch}/></Router>);

        expect(asFragment()).toMatchSnapshot();
        
        const compareButton = container.querySelector(".home__link");

        fireEvent.click(compareButton);

        await waitFor(() => expect(container.querySelector('.file-input')).not.toBeNull());
        expect(asFragment()).toMatchSnapshot();
    });
});

import React from "react";
import '@testing-library/jest-dom';
import {render, waitFor} from '@testing-library/react';
import Home from "./Home";
import {BrowserRouter as Router} from "react-router-dom";

describe('Home', () => {
    test('Render home page', async () => {
        const { asFragment, container  } = render(<Router basename="/"><Home /></Router>);
        await waitFor(() => expect(container.querySelector('.home__link-container--projects')).not.toBeNull());
        expect(asFragment()).toMatchSnapshot();
    });
});

import React from "react";
import '@testing-library/jest-dom';
import {render} from '@testing-library/react';
import { Home } from "./Home";
import {BrowserRouter as Router} from "react-router-dom";

describe('Check page shifting', () => {
    test('Render home page and go to compare page', async () => {
        const { asFragment  } = render(<Router basename="/"><Home /></Router>);

        expect(asFragment()).toMatchSnapshot();
    });
});

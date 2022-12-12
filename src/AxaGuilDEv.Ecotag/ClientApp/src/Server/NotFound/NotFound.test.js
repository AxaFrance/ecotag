import React from 'react';
import NotFound from './NotFound.component';
import {render} from "@testing-library/react";
import {BrowserRouter} from "react-router-dom";

describe('NotFound', () => {
    it('1. Renders NotFound page component without crashing', () => {
        const {asFragment} = render(<BrowserRouter><NotFound/></BrowserRouter>);
        expect(asFragment()).toMatchSnapshot();
    });
});

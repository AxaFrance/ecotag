import {render} from "@testing-library/react";
import {BrowserRouter as Router} from "react-router-dom";
import React from "react";
import {Confirm} from "./Confirm";

describe('Confirm', () => {
    it('Should render correctly', () => {
        const {asFragment} = render(<Router><Confirm fetch={fetch}/></Router>);
        expect(asFragment()).toMatchSnapshot();
    })
})
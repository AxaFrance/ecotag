import {render} from "@testing-library/react";
import {BrowserRouter as Router} from "react-router-dom";
import React from "react";
import {Confirm} from "./Confirm";

jest.mock("react-router-dom", () => ({
    ...jest.requireActual("react-router-dom"),
    useLocation: () => ({
        state: {filesResult: {firstFile: "InvalidFileExtension", secondFile: null, thirdFile: "InvalidFileExtension"}}
    })
}));

describe('Confirm', () => {
    it('Should render correctly', () => {
        const {container, asFragment} = render(<Router><Confirm fetch={fetch} /></Router>);
        expect(asFragment()).toMatchSnapshot();
    })
})
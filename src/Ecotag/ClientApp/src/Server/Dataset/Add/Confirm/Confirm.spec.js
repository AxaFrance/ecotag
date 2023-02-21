import {render} from "@testing-library/react";
import {BrowserRouter as Router} from "react-router-dom";
import React from "react";
import {Confirm} from "./Confirm";
import {changeProjectTranslationLanguage} from "../../../../translations/useProjectTranslation";

describe('Confirm', () => {
    const renderComponentAndCheckSnapshot = () => {
        const {asFragment} = render(<Router><Confirm fetch={fetch}/></Router>);
        expect(asFragment()).toMatchSnapshot();
    };

    it('Should render correctly in english', () => {
        changeProjectTranslationLanguage('en');
        renderComponentAndCheckSnapshot();
    });
    it('should render correctly in french', () => {
        changeProjectTranslationLanguage('fr');
        renderComponentAndCheckSnapshot();
    });
})
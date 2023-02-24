import '@testing-library/jest-dom/extend-expect';
import React from 'react';
import {render, waitFor} from '@testing-library/react';
import {ActionBar} from './ActionBar';
import {BrowserRouter as Router} from "react-router-dom";
import {DataScientist} from "../../withAuthentication";
import {changeProjectTranslationLanguage} from "../../../translations/useProjectTranslation";

describe('ActionBar', () => {
    const renderComponentAndCheckSnapshot = async(expectedText) => {
        const regex = new RegExp(expectedText, 'i');
        const {asFragment, getByText} = render(<Router><ActionBar user={{roles: [DataScientist]}} projectId={"0001"}
                                                                  projectName={"projectName"}
                                                                  isAnnotationClosed={false}/></Router>);
        const messageEl = await waitFor(() => getByText(regex));
        expect(messageEl).toHaveTextContent(
            expectedText
        );
        expect(asFragment()).toMatchSnapshot();
    };

    it('should render correctly in english', async () => {
        changeProjectTranslationLanguage('en');
        await renderComponentAndCheckSnapshot('Start tagging');
    });
    it('should render correctly in french', async() => {
        changeProjectTranslationLanguage('fr');
        await renderComponentAndCheckSnapshot('Commencer à annoter');
    })
});

import '@testing-library/jest-dom/extend-expect';
import React from 'react';
import {getByText, render, waitFor} from '@testing-library/react';
import {HomeContainer} from './Home.container';
import {BrowserRouter as Router} from 'react-router-dom';
import {changeProjectTranslationLanguage} from '../../../translations/useProjectTranslation';

const fetch = async (url, config) => {

    if (url.includes("datasets")) {
        return {
            ok: true, json: () => Promise.resolve([{
                "id": "0001",
                "name": "Green card",
                "type": "Image",
                "groupId": "1",
                "classification": "Public",
                "numberFiles": 300,
                "createDate": new Date("10-30-2019").getTime()
            }])
        };
    }

    return {
        ok: true, json: () => Promise.resolve([{
            "id": "1",
            "name": "My team"
        }])
    };
};

describe('Home.container', () => {

    const renderComponentAndCheckSnapshot = async () => {
        const {asFragment, getByText} = render(<Router><HomeContainer fetch={fetch}/></Router>);
        const messageEl = await waitFor(() => getByText('Green card'));
        expect(messageEl).toHaveTextContent(
            'Green card'
        );
        expect(asFragment()).toMatchSnapshot();
    };

    it('should render correctly in english', async () => {
        changeProjectTranslationLanguage('en');
        await renderComponentAndCheckSnapshot();
    });

    it('should render correctly in french', async () => {
        changeProjectTranslationLanguage('fr');
        await renderComponentAndCheckSnapshot();
    });
});

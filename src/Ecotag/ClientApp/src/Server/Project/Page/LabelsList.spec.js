import '@testing-library/jest-dom/extend-expect';
import React from 'react';
import {render, waitFor} from '@testing-library/react';
import {Label} from './LabelsList';
import {BrowserRouter as Router} from 'react-router-dom';
import {changeProjectTranslationLanguage} from '../../../useProjectTranslation';

const labels = [
    {
        id: 'id',
        name: 'label',
        color: 'red'
    }
];

describe('Label', () => {
    const renderComponentAndCheckSnapshot = async(expectedText) => {
        const regex = new RegExp(expectedText, 'i');
        const {asFragment, getByText} = render(<Router><Label labels={labels}/></Router>);
        const messageEl = await waitFor(() => getByText(regex));
        expect(messageEl).toHaveTextContent(
            expectedText
        );
        expect(asFragment()).toMatchSnapshot();
    };
    it('should render correctly in english', async () => {
        changeProjectTranslationLanguage('en');
        await renderComponentAndCheckSnapshot("Color");
    });
    it('should render correctly in french', async() => {
        changeProjectTranslationLanguage('fr');
        await renderComponentAndCheckSnapshot("Couleur");
    });
});

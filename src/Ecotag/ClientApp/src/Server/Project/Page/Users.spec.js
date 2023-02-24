import '@testing-library/jest-dom/extend-expect';
import React from 'react';
import {render, waitFor} from '@testing-library/react';
import {UserAnnotationsStatus} from './Users';
import {BrowserRouter as Router} from 'react-router-dom';
import {changeProjectTranslationLanguage} from '../../../translations/useProjectTranslation';

const users = [
    {
        id: "0001",
        "email": "guillaume.chervet@axa.fr",
        "nameIdentifier": "S000007"
    },
    {
        id: "0002",
        "email": "lilian.delouvy@axa.fr",
        "nameIdentifier": "S000005"
    }
]

const numberAnnotationsByUsers = [{"nameIdentifier": "S000005", numberAnnotations: 15}, {
    "nameIdentifier": "S000007",
    numberAnnotations: 35
}]

describe('Users', () => {
    const renderComponentAndCheckSnapshot = async(expectedText) => {
        const regex = new RegExp(expectedText, 'i');
        const {asFragment, getByText} = render(<Router><UserAnnotationsStatus users={users}
                                                                              numberAnnotationsByUsers={numberAnnotationsByUsers}/></Router>);
        await waitFor(() => expect(getByText(regex)).not.toBeNull());
        expect(asFragment()).toMatchSnapshot();
    };
    it('should render correctly in english', async () => {
        changeProjectTranslationLanguage('en');
        await renderComponentAndCheckSnapshot("Annotations number");
    });
    it('should render correctly in french', async() => {
        changeProjectTranslationLanguage('fr');
        await renderComponentAndCheckSnapshot("Nombre d'annotations");
    });
});


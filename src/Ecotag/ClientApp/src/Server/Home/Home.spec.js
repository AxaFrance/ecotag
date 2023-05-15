import React from 'react';
import '@testing-library/jest-dom';
import {render, waitFor} from '@testing-library/react';
import {Home} from './Home';
import {BrowserRouter as Router} from 'react-router-dom';
import {Administateur, Annotateur, DataScientist} from '../withAuthentication';
import {OidcUserStatus} from '@axa-fr/react-oidc';
import {changeProjectTranslationLanguage} from "../../useProjectTranslation";

describe.each([
    [`${DataScientist},${Annotateur}`],
    [Annotateur],
    [`${DataScientist},${Annotateur},${Administateur}`],
    [""]
])('Home %p', (roles) => {
    test('Render home page with correct buttons depending on user roles', async () => {
        changeProjectTranslationLanguage('en');
        const user = {
            roles: roles ? roles.split(",") : [],
            name: 'Guillaume Chervet'
        }
        const {container, asFragment} = render(<Router basename="/"><Home user={user}
                                                                          userLoadingState={OidcUserStatus.Loaded}/></Router>);

        if (roles.includes(Annotateur)) {
            await waitFor(() => expect(container.querySelector('.home__link-container--projects')).not.toBeNull());
        }
        if (roles.includes(DataScientist)) {
            await waitFor(() => expect(container.querySelector('.home__link-container--datasets')).not.toBeNull());
        }
        if (roles.includes(Administateur)) {
            await waitFor(() => expect(container.querySelector('.home__link-container--groups')).not.toBeNull());
        }

        expect(asFragment()).toMatchSnapshot();
    });
});

describe('Home translation', () => {
    const user = {
        roles: [DataScientist,Annotateur,Administateur],
        name: 'Guillaume Chervet'
    };

    it('Renders component with english translation', () => {
        changeProjectTranslationLanguage('en');
        const {asFragment} = render(<Router basename="/"><Home user={user} userLoadingState={OidcUserStatus.Loaded}/></Router>);
        expect(asFragment()).toMatchSnapshot();
    });
    it('Renders component with french translation', () => {
        changeProjectTranslationLanguage('fr');
        const {asFragment} = render(<Router basename="/"><Home user={user} userLoadingState={OidcUserStatus.Loaded}/></Router>);
        expect(asFragment()).toMatchSnapshot();
    });
});

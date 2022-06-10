import React from "react";
import '@testing-library/jest-dom';
import {render, waitFor} from '@testing-library/react';
import {Home} from "./Home";
import {BrowserRouter as Router} from "react-router-dom";
import {Administateur, Annotateur, DataScientist} from "../withAuthentication";
import {OidcUserStatus} from "@axa-fr/react-oidc";


describe.each([
    [`${DataScientist},${Annotateur}`],
    [Annotateur],
    [`${DataScientist},${Annotateur},${Administateur}`],
    [""]
])('Home %p', (roles) => {
    test('Render home page', async () => {
        const user = {
            roles:roles ? roles.split(","): [],
            name: 'Guillaume Chervet'
        }
        const { container, asFragment } = render(<Router basename="/"><Home user={user} userLoadingState={OidcUserStatus.Loaded} /></Router>);

        if(roles.includes(Annotateur)) {
            await waitFor(() => expect(container.querySelector('.home__link-container--projects')).not.toBeNull());
        }
        if(roles.includes(DataScientist)) {
            await waitFor(() => expect(container.querySelector('.home__link-container--datasets')).not.toBeNull());
        }
        if(roles.includes(Administateur)) {
            await waitFor(() => expect(container.querySelector('.home__link-container--groups')).not.toBeNull());
        }
        
        
       expect(asFragment()).toMatchSnapshot();
    });
});

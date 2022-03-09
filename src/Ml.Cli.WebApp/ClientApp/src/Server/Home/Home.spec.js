import React from "react";
import '@testing-library/jest-dom';
import {render, waitFor} from '@testing-library/react';
import {Home} from "./Home";
import {BrowserRouter as Router} from "react-router-dom";


describe.each([
    ["ECOTAG_DATA_SCIENTIST,ECOTAG_ANNOTATEUR"],
    ["ECOTAG_ANNOTATEUR"],
    ["ECOTAG_ADMINISTRATEUR,ECOTAG_DATA_SCIENTIST,ECOTAG_ANNOTATEUR"],
    [""]
])('Home (%i)', (roles) => {
    test('Render home page', async () => {
        const user = {
            roles:roles ? roles.split(","): [],
            name: 'Guillaume Chervet'
        }
        const { container } = render(<Router basename="/"><Home user={user} /></Router>);

        if(roles.includes("ECOTAG_ANNOTATEUR")) {
            await waitFor(() => expect(container.querySelector('.home__link-container--projects')).not.toBeNull());
        }
        if(roles.includes("ECOTAG_DATA_SCIENTIST")) {
            await waitFor(() => expect(container.querySelector('.home__link-container--datasets')).not.toBeNull());
        }
        if(roles.includes("ECOTAG_ADMINISTRATEUR")) {
            await waitFor(() => expect(container.querySelector('.home__link-container--groups')).not.toBeNull());
        }
        
        
       // expect(asFragment()).toMatchSnapshot();
    });
});

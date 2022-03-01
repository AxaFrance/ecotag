import React from "react";
import '@testing-library/jest-dom';
import {render} from '@testing-library/react';
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
        const { asFragment  } = render(<Router basename="/"><Home user={user} /></Router>);
        expect(asFragment()).toMatchSnapshot();
    });
});

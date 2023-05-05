import '@testing-library/jest-dom/extend-expect';
import React from 'react';
import {render, waitFor} from '@testing-library/react';
import {HomeContainer} from './Home.container';
import {BrowserRouter as Router} from "react-router-dom";

import {fetch} from './mock';
import {Annotateur, DataScientist} from "../../withAuthentication";
import {changeProjectTranslationLanguage} from "../../../useProjectTranslation";


describe.each([
    [`${DataScientist},${Annotateur}`],
    [Annotateur],
])('Home.container %p', (roles) => {
    const renderComponentAndCheckSnapshots = async() => {
        const user = {roles}
        const {asFragment, getByText} = render(<Router><HomeContainer fetch={fetch} user={user}/></Router>);
        const messageEl = await waitFor(() => getByText('31/03/0001'));
        expect(messageEl).toHaveTextContent(
            '31/03/0001'
        );
        expect(asFragment()).toMatchSnapshot();
    }
    it('should render correctly in english', async () => {
        changeProjectTranslationLanguage('en');
        await renderComponentAndCheckSnapshots();
    });
    it('should render correctly in french', async () => {
        changeProjectTranslationLanguage('fr');
        await renderComponentAndCheckSnapshots();
    });
});


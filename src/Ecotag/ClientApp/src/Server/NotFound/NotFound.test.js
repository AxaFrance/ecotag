import React from 'react';
import NotFound from './NotFound.component';
import {render} from '@testing-library/react';
import {BrowserRouter} from 'react-router-dom';
import {changeProjectTranslationLanguage} from "../../useProjectTranslation";

describe('NotFound', () => {
    it('Renders NotFound page component with correct english translation', () => {
        const {asFragment} = render(<BrowserRouter><NotFound/></BrowserRouter>);
        expect(asFragment()).toMatchSnapshot();
    });
    it('Renders NotFound page component with correct french translation', () => {
        changeProjectTranslationLanguage('fr');
        const {asFragment} = render(<BrowserRouter><NotFound/></BrowserRouter>);
        expect(asFragment()).toMatchSnapshot();
    });
});

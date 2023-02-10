import React from 'react';
import NotFound from './NotFound.component';
import {render} from '@testing-library/react';
import {BrowserRouter} from 'react-router-dom';
import '../../i18n';
import i18next from 'i18next';

describe('NotFound', () => {
    it('Renders NotFound page component with correct english translation', () => {
        const {asFragment} = render(<BrowserRouter><NotFound/></BrowserRouter>);
        expect(asFragment()).toMatchSnapshot();
    });
    it('Renders NotFound page component with correct french translation', () => {
        i18next.changeLanguage('fr');
        const {asFragment} = render(<BrowserRouter><NotFound/></BrowserRouter>);
        expect(asFragment()).toMatchSnapshot();
    });
});

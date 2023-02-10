import React from 'react';
import '@testing-library/jest-dom';
import {render} from '@testing-library/react';
import {AppHeader} from './Header';
import '../../../i18n';
import i18next from 'i18next';

describe('Header', () => {
    const user = {
        roles: ["youhou", "youhou"],
        name: 'Guillaume Chervet'
    };

    it('Renders header page in english', async () => {
        const {asFragment} = render(<AppHeader user={user}/>);
        expect(asFragment()).toMatchSnapshot();
    });
    it('Renders header page in french', () => {
        i18next.changeLanguage('fr');
        const {asFragment} = render(<AppHeader user={user}/>);
        expect(asFragment()).toMatchSnapshot();
    });
});

import React from 'react';
import {Header, Name, User} from '@axa-fr/react-toolkit-all';
import logo from '@axa-fr/react-toolkit-core/dist/assets/logo-axa.svg';
import withAuthentication from '../../withAuthentication';
import './Header.scss';

const formatRoles = (roles) => {
    return roles.reduce(
        (previousValue, currentValue) => {
            if (!previousValue) {
                return currentValue;
            }
            return `${previousValue}, ${currentValue}`;
        },
        ''
    );
}

export const AppHeader = ({ user: { title = 'Ecotag', link = null, name = 'Non Connecté', roles = ['NOT_FOUND'] } }) => (
  <Header>
    <Name title={title} subtitle="An eco-system that aim to be eco for the planet" img={logo} alt={title} />
    <User name={name} href={link} profile={formatRoles(roles)} />
  </Header>
);

export default withAuthentication()(AppHeader);

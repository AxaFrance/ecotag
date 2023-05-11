import React from 'react';
import {Header, Name, User} from '@axa-fr/react-toolkit-all';
import logo from '@axa-fr/react-toolkit-core/dist/assets/logo-axa.svg';
import withAuthentication from '../../withAuthentication';
import i18next from "i18next";
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

export const AppHeader = ({user: {title = 'Ecotag', link = null, name = i18next.t('shared.header.errors.not_connected'), roles = ['NOT_FOUND']}}) => (
    <Header>
        <Name title={title} subtitle={i18next.t('shared.header.title')} img={logo} alt={title}/>
        <User name={name} href={link} profile={formatRoles(roles)}/>
    </Header>
);

export default withAuthentication()(AppHeader);

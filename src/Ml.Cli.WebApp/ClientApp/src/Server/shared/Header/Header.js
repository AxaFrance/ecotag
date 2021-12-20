import React from 'react';
import { Header, Name, User } from '@axa-fr/react-toolkit-all';
import logo from '@axa-fr/react-toolkit-core/dist/assets/logo-axa.svg';
import withAuthentication from '../../withAuthentication';
import './Header.scss';

export const HeaderApp = ({ user: { title = 'Ecotag', link = null, name = 'Non Connecté', role = 'ADMIN' } }) => (
  <Header>
    <Name title={title} img={logo} alt={title} />
    <User name={name} href={link} profile={role} />
  </Header>
);

export default withAuthentication()(HeaderApp);

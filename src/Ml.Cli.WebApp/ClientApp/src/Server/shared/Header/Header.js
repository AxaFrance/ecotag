import React from 'react';
import { Header, Name, User } from '@axa-fr/react-toolkit-all';
import logo from '@axa-fr/react-toolkit-core/dist/assets/logo-axa.svg';
import withAuthentication from '../../withAuthentication';
import './Header.scss';

export const HeaderApp = ({ user: { title = 'Ecotag', link = null, name = 'Non Connecté', role = 'ADMIN' } }) => (
  <Header>
    <Name title={title} subtitle="An eco-system that aim to be eco for the planet" img={logo} alt={title} />
    <User name={name} href={link} profile={role} />
  </Header>
);

export default withAuthentication()(HeaderApp);

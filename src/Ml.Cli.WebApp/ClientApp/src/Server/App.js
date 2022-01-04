import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { AuthenticationProvider, withOidcSecure } from '@axa-fr/react-oidc-context';
import EnvironmentProvider, { withEnvironment } from './EnvironmentProvider';
import './App.scss';
import Header from './shared/Header';
import Footer from './shared/Footer';

import Routes from './AppRoutes';
import {Helmet} from "react-helmet";

export const RoutesBase = ({ environment }) => (
  <Router basename={environment.baseUrl}>
      <Header />
      <Routes />
      <Footer />
  </Router>
);

const SecureRouteBase = withOidcSecure(RoutesBase);

const Authentification = ({ environment }) => (
  <AuthenticationProvider configuration={environment.oidc.configuration} isEnabled={environment.oidc.isEnabled}>
    <SecureRouteBase environment={environment} />
  </AuthenticationProvider>
);

const AuthentificationWithEnvironment = withEnvironment(Authentification);

const App = () => (
    <>
        <Helmet>
            <title>Ecotag</title>
            <meta
                name="description"
                content="Website part of the Ml Cli tool"
            />
        </Helmet>
  <EnvironmentProvider>
    <AuthentificationWithEnvironment />
  </EnvironmentProvider>
        </>
);

export default App;

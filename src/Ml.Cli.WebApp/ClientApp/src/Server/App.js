import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { OidcProvider, withOidcSecure } from '@axa-fr/react-oidc-context';
import EnvironmentProvider, { withEnvironment } from './EnvironmentProvider';
import './App.scss';
import Header from './shared/Header';
import Footer from './shared/Footer';

import Routes from './AppRoutes';
import {Helmet} from "react-helmet";
import TelemetryProvider from './Telemetry';

export const RoutesBase = ({ environment }) => (
  <Router basename={environment.baseUrl}>
      <Header />
      <Routes />
      <Footer />
  </Router>
);

const SecureRouteBase = withOidcSecure(RoutesBase);

const Authentification = ({ environment }) => (
    <TelemetryProvider {...environment.telemetry} >
      <OidcProvider configuration={environment.oidc.configuration} >
        <SecureRouteBase environment={environment} />
      </OidcProvider>
    </TelemetryProvider>
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

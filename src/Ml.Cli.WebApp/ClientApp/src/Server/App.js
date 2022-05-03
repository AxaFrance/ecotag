import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { OidcProvider, withOidcSecure } from '@axa-fr/react-oidc';
import EnvironmentProvider, { withEnvironment } from './EnvironmentProvider';
import './App.scss';
import Header from './shared/Header';
import Footer from './shared/Footer';

import Routes from './AppRoutes';
import {Helmet} from "react-helmet";
import TelemetryProvider from './Telemetry';
import Loading from "./shared/Oidc/Loading.component";
import AuthenticatingError from "./shared/Oidc/AuthenticateError.component";
import Authenticating from "./shared/Oidc/Authenticating.component";
import SessionLost from "./shared/Oidc/SessionLost.component";
import ServiceWorkerNotSupported from "./shared/Oidc/ServiceWorkerNotSupported.component";
import {CallBackSuccess} from "./shared/Oidc/Callback.component";

export const RoutesBase = ({ environment }) => (
  <Router basename={environment.baseUrl}>
      <Header />
      <Routes />
      <Footer />
  </Router>
);

const SecureRouteBase = withOidcSecure(RoutesBase);

const Authentification = ({ environment }) => (
      <OidcProvider configuration={environment.oidc.configuration}
                    loadingComponent={Loading}
                    authenticatingErrorComponent={AuthenticatingError}
                    authenticatingComponent={Authenticating}
                    sessionLostComponent={SessionLost}
                    serviceWorkerNotSupportedComponent={ServiceWorkerNotSupported}
                    callbackSuccessComponent={CallBackSuccess}>
          <TelemetryProvider {...environment.telemetry} >
              <SecureRouteBase environment={environment} />
          </TelemetryProvider>
      </OidcProvider>
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

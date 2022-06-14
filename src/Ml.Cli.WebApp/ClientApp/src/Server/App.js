import React from 'react';
import {BrowserRouter as Router, Route, Switch} from 'react-router-dom';
import {OidcProvider, OidcSecure} from '@axa-fr/react-oidc';
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
import AccessToken from "./AccessToken";

const AppWithOidcProvider = withEnvironment(({ environment }) => (
    <OidcProvider configuration={environment.oidc.configuration}
                  loadingComponent={Loading}
                  authenticatingErrorComponent={AuthenticatingError}
                  authenticatingComponent={Authenticating}
                  sessionLostComponent={SessionLost}
                  serviceWorkerNotSupportedComponent={ServiceWorkerNotSupported}
                  callbackSuccessComponent={CallBackSuccess}>
        <TelemetryProvider {...environment.telemetry} >
            <OidcSecure>
                <Header />
                <Routes />
                <Footer />
            </OidcSecure>
        </TelemetryProvider>
    </OidcProvider>));



const Authentification = ({ environment }) => (
    <Router basename={environment.baseUrl}>
        <Switch>
            <Route path="/access_token" component={AccessToken}    />
            <Route component={AppWithOidcProvider} />
        </Switch>
    </Router>
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

import React from 'react';
import ReactDOM from 'react-dom';
import '@axa-fr/react-toolkit-all/dist/style/bootstrap/grid.css';
import '@axa-fr/react-toolkit-all/dist/style/bootstrap/reboot.css';
import '@axa-fr/react-toolkit-core/dist/assets/fonts/icons/af-icons.css';
import '@axa-fr/react-toolkit-all/dist/style/af-components.css';
import '@axa-fr/react-toolkit-table/dist/af-table.css';
import '@axa-fr/react-toolkit-form-input-select/dist/select.scss';
import {HashRouter} from "react-router-dom";
import Routes from "./Routes";
import EnvironmentProvider, {withEnvironment} from "./EnvironmentProvider";
import {Helmet} from "react-helmet";

export const App = ({environment}) => (
    <>
        <Helmet>
            <title>Ml Cli</title>
            <meta
                name="description"
                content="Website part of the Ml Cli tool"
            />
        </Helmet>
        <HashRouter basename={environment.basePath}>
            <Routes/>
        </HashRouter>
    </>
);

const AppWithEnvironment = withEnvironment(App);

const AppWithProvider = () =>
    <EnvironmentProvider>
        <AppWithEnvironment/>
    </EnvironmentProvider>;


export default AppWithProvider;

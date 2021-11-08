import React from 'react';
import ReactDOM from 'react-dom';
import './scss/grid.css';
import './scss/reboot.css';
import '@axa-fr/react-toolkit-all/dist/style/af-components.css';
import '@axa-fr/react-toolkit-table/dist/af-table.css';
import '@axa-fr/react-toolkit-form-input-select/dist/select.scss';
import {HashRouter} from "react-router-dom";
import {BrowserRouter} from "react-router-dom";
import Routes from "./Routes";
import EnvironmentProvider, {withEnvironment} from "./EnvironmentProvider";

export const App = ({environment}) => (
    <HashRouter basename={environment.basePath}>
        <Routes/>
    </HashRouter>
);

const AppWithEnvironment = withEnvironment(App);

ReactDOM.render(
    <React.StrictMode>
        <EnvironmentProvider>
            <AppWithEnvironment/>
        </EnvironmentProvider>
    </React.StrictMode>,
    document.getElementById('root')
);

export default App;

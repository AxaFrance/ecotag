import React from 'react';
import ReactDOM from 'react-dom';
import './scss/grid.css';
import './scss/reboot.css';
import '@axa-fr/react-toolkit-all/dist/style/af-components.css';
import '@axa-fr/react-toolkit-table/dist/af-table.css';
import '@axa-fr/react-toolkit-form-input-select/dist/select.scss';
import {BrowserRouter as Router} from "react-router-dom";
import Routes from "./Routes";

const baseName = "/";

export const App = () => (
    <Router basename={baseName}>
        <Routes/>
    </Router>
);

ReactDOM.render(
    <React.StrictMode>
        <App/>
    </React.StrictMode>,
    document.getElementById('root')
);

export default App;

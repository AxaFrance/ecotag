import React from 'react';
import './scss/grid.css';
import './scss/reboot.css';
import ReactDOM from "react-dom";
import AppLazySwitcher from "./AppLazySwitcher";
import ErrorBoundary from "./ErrorBoundary";
import './i18n';


ReactDOM.render(
    <React.StrictMode>
        <ErrorBoundary>
            <AppLazySwitcher/>
        </ErrorBoundary>
    </React.StrictMode>,
    document.getElementById('root')
);

  




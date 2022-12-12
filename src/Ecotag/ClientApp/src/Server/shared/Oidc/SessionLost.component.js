import React from 'react';
import {style} from "./style"
import Button from '@axa-fr/react-toolkit-button';
import {useOidc} from "@axa-fr/react-oidc";

export const SessionLost = ({configurationName}) => {
    const {login} = useOidc(configurationName);
    return (
        <div className="oidc-session-lost" style={style}>
            <div className="oidc-session-lost__container">
                <h1 className="oidc-session-lost__title">Session expirée</h1>
                <p className="oidc-session-lost__content">
                    Votre session a expiré. Veuillez vous ré-authentifier.
                </p>
                <Button name="reauthenticate" onClick={() => login()}>
                    <span className="af-btn-text">Ré-authentifier</span>
                </Button>
            </div>
        </div>
    )
};

export default SessionLost;

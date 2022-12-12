import * as React from 'react';
import {style} from "./style";
import {useOidc} from "@axa-fr/react-oidc";
import Button from '@axa-fr/react-toolkit-button';

const AuthenticatingError = () => {
    const {login} = useOidc();

    return (
        <div className="oidc-authenticating" style={style}>
            <div className="oidc-authenticating__container">
                <h1 className="oidc-authenticating__title">Authentification erreur</h1>
                <p className="oidc-authenticating__content">Une erreur s'est produite lors de l'authentification.</p>
                <Button name="reauthenticate" onClick={() => login("/")}>
                    <span className="af-btn-text">Ré-authentifier</span>
                </Button>
            </div>
        </div>
    );
}

export default AuthenticatingError;

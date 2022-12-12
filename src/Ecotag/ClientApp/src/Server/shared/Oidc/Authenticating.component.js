import * as React from 'react';
import {style} from "./style";

const Authenticating = () => (
    <div className="oidc-authenticating" style={style}>
        <div className="oidc-authenticating__container">
            <h1 className="oidc-authenticating__title">Authentification en cours</h1>
            <p className="oidc-authenticating__content">Vous serez redirigé vers la page de connexion.</p>
        </div>
    </div>
);

export default Authenticating;

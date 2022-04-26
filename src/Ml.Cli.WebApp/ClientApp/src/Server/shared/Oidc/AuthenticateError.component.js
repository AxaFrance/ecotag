import * as React from 'react';
import {style} from "./style";

const AuthenticatingError = () => (
     <div className="oidc-authenticating" style={style}>
        <div className="oidc-authenticating__container">
          <h1 className="oidc-authenticating__title">Error authentication</h1>
          <p className="oidc-authenticating__content">Une erreur s'est produite lors de l'authentification.</p>
        </div>
     </div>
);

export default AuthenticatingError;

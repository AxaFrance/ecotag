import React from 'react';
import {style} from "./style";

export const CallBackSuccess = () =>  (<div className="oidc-callback"  style={style}>
  <div className="oidc-callback__container">
    <h1 className="oidc-callback__title">Authentification terminée</h1>
    <p className="oidc-callback__content">Vous allez être redirigé vers votre application.</p>
  </div>
</div>
);

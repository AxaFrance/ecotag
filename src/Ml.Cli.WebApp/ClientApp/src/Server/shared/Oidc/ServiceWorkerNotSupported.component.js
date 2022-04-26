import * as React from 'react';
import {style} from "./style";

const ServiceWorkerNotSupported = () => (
  <div className="oidc-serviceworker" style={style}>
    <div className="oidc-serviceworker__container">
      <h1 className="oidc-serviceworker__title">Impossible de s'authentifier sur ce navigateur</h1>
      <p className="oidc-serviceworker__content">Votre navigateur n’est pas assez sécurisé pour que l’authentification fonctionne. Essayez de mettre à jour votre navigateur ou d’utiliser un navigateur plus récent.</p>
    </div>
  </div>
);

export default ServiceWorkerNotSupported;

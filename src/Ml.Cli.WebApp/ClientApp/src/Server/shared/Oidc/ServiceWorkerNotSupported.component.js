import * as React from 'react';
import {style} from "./style";

const ServiceWorkerNotSupported = () => (
  <div className="oidc-serviceworker" style={style}>
    <div className="oidc-serviceworker__container">
      <h1 className="oidc-serviceworker__title">Impossible de s'authentifier sur ce navigateur</h1>
      <p className="oidc-serviceworker__content">Votre browser is not secure enough to make authentication work. Try updating your browser or use a newer browser.</p>
    </div>
  </div>
);

export default ServiceWorkerNotSupported;

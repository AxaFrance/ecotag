import {OidcProvider, OidcSecure, useOidcAccessToken} from "@axa-fr/react-oidc";
import React from "react";
import {withEnvironment} from "./EnvironmentProvider";
import Loading from "./shared/Oidc/Loading.component";
import AuthenticatingError from "./shared/Oidc/AuthenticateError.component";
import Authenticating from "./shared/Oidc/Authenticating.component";
import SessionLost from "./shared/Oidc/SessionLost.component";
import ServiceWorkerNotSupported from "./shared/Oidc/ServiceWorkerNotSupported.component";
import {CallBackSuccess} from "./shared/Oidc/Callback.component";

const configurationName = "access_token"

const AccessTokenWithProvider = withEnvironment(({environment}) => {

    navigator.serviceWorker.getRegistrations().then(function(registrations) {
        for(let registration of registrations) {
            registration.unregister()
        } })
    const config = environment.oidc.configuration
    const configuration = {
        ...config,
        scope : config.scope.replace("offline_access", ""),
        service_worker_relative_url: null,
        service_worker_only:false,
        redirect_uri: window.location.origin + '/access-token/authentication/callback'
    };

    return <OidcProvider configuration={configuration} configurationName={configurationName}
                         loadingComponent={Loading}
                         authenticatingErrorComponent={AuthenticatingError}
                         authenticatingComponent={Authenticating}
                         sessionLostComponent={SessionLost}
                         serviceWorkerNotSupportedComponent={ServiceWorkerNotSupported}
                         callbackSuccessComponent={CallBackSuccess}>
        <OidcSecure configurationName={configurationName}>
            <AccessToken/>
        </OidcSecure>
    </OidcProvider>
});

const AccessToken =() => {
    const{ accessToken } = useOidcAccessToken(configurationName);
    return <><h1>Access Token</h1><p style={{"maxWidth":"100%", "wordBreak": "break-all"}}>{accessToken}</p></>;
}

export default AccessTokenWithProvider;
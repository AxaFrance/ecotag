import {OidcProvider, OidcSecure, useOidcAccessToken} from "@axa-fr/react-oidc";
import React from "react";
import {withEnvironment} from "./EnvironmentProvider";
import Loading from "./shared/Oidc/Loading.component";
import AuthenticatingError from "./shared/Oidc/AuthenticateError.component";
import Authenticating from "./shared/Oidc/Authenticating.component";
import SessionLost from "./shared/Oidc/SessionLost.component";
import ServiceWorkerNotSupported from "./shared/Oidc/ServiceWorkerNotSupported.component";
import {CallBackSuccess} from "./shared/Oidc/Callback.component";
import {useHistory} from "react-router";

const configurationName = "access_token"

const AccessTokenWithProvider = withEnvironment(({environment}) => {

    let history = useHistory();

    const withCustomHistory = () => {
        return {
            replaceState: (url, stateHistory) => {
                history.replace(url);
                window.dispatchEvent(new Event('popstate'));
            }
        };
    };


    const config = environment.oidc.configuration
    const configuration = {
        ...config,
        scope: config.scope.replace("offline_access", ""),
        redirect_uri: window.location.origin + '/access-token/authentication/callback'
    };

    return <OidcProvider configuration={configuration} configurationName={configurationName}
                         loadingComponent={Loading}
                         authenticatingErrorComponent={AuthenticatingError}
                         authenticatingComponent={Authenticating}
                         sessionLostComponent={SessionLost}
                         serviceWorkerNotSupportedComponent={ServiceWorkerNotSupported}
                         callbackSuccessComponent={CallBackSuccess}
                         withCustomHistory={withCustomHistory}
    >
        <OidcSecure configurationName={configurationName}>
            <AccessToken/>
        </OidcSecure>
    </OidcProvider>
});

const AccessToken = () => {
    const {accessToken} = useOidcAccessToken(configurationName);
    return <><h1>Access Token</h1><p style={{"maxWidth": "100%", "wordBreak": "break-all"}}>{accessToken}</p></>;
}

export default AccessTokenWithProvider;
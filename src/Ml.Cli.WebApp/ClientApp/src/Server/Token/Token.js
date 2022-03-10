import React from "react";
import './Home.scss';
import {withEnvironment} from "../EnvironmentProvider";
import { OidcProvider, OidcSecure } from '@axa-fr/react-oidc-context';
export const Token = ({environment}) => {
    
    const oidcConfiguration = environment.oidc.configuration
    
    const configuration = {
        ...oidcConfiguration, 
        redirect_uri: oidcConfiguration.redirect_uri + "/access_token_only",
        scope: oidcConfiguration.scope.replace('offline_access', "")
    }
   
   return (<OidcProvider configuration={configuration}  >
        <OidcSecure>
            <p>Vous êtes connecté: </p>
        </OidcSecure>
    </OidcProvider>
   )
};

export default withEnvironment(Token);

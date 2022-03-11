import React from "react";
import './Token.scss';
import {withEnvironment} from "../EnvironmentProvider";
import {OidcProvider, OidcSecure, useOidcAccessToken} from '@axa-fr/react-oidc-context';
import Title from "../../TitleBar";
import withAuthentication, {Administateur, Annotateur, DataScientist} from "../withAuthentication";
import {Link} from "react-router-dom";

export const Token = ({environment}) => {
    const oidcConfiguration = environment.oidc.configuration
    const configuration = {
        ...oidcConfiguration, 
        redirect_uri: window.location.origin+"/token/authentification/callback",
        scope: oidcConfiguration.scope.replace('offline_access', ""),
        service_worker_relative_url:null,
        service_worker_only: false
    };
   return (<OidcProvider configuration={configuration} configurationName={"config_access_token_only"} >
        <OidcSecure  configurationName={"config_access_token_only"}>
            <div className="home">
                <Title title="Token" goButton={false}/>
                <div className="home__links-container">
                    <DisplayAccessToken/>
                </div>
            </div>
        </OidcSecure>
    </OidcProvider>
   )
};


const DisplayAccessToken = () => {
    const{ accessToken, accessTokenPayload } = useOidcAccessToken("config_access_token_only");

    if(!accessToken){
        return <p>you are not authentified</p>
    }
    return (
        <div className="card text-white bg-info mb-3">
            <div className="card-body">
                <h5 className="card-title">Access Token</h5>
                <p style={{color:'red', "backgroundColor": 'white'}}>Please consider to configure the ServiceWorker in order to protect your application from XSRF attacks. "access_token" and "refresh_token" will never be accessible from your client side javascript.</p>
                {accessToken != null && <p className="card-text">Access Token: {JSON.stringify(accessToken)}</p>}
                {accessTokenPayload != null && <p className="card-text">Access Token Payload: {JSON.stringify(accessTokenPayload)}</p>}
            </div>
        </div>
    )
};

const TokenWithEnvironment = withEnvironment(Token);

const SecureToken = ({ user: { roles = [] } })=>{
    console.log(roles);
    
    return <> <TokenWithEnvironment /> </>;
}

export default withAuthentication()(SecureToken);

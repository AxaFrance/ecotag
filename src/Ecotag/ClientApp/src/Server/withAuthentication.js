import React from 'react';
import {useOidcAccessToken, useOidcIdToken, useOidcUser} from '@axa-fr/react-oidc';
import {EnvironmentConsumer} from './EnvironmentProvider';

const NON_CONNECTE = 'Non Connecté';

const getAuthName = (dataArray, propertyName = "name", defaultResult = NON_CONNECTE) => {

    for (let i = 0; i < dataArray.length; i++) {
        const item = dataArray[i];
        if (item && item[propertyName]) {
            return item[propertyName];
        }
    }

    return defaultResult;
}

export const DataScientist = "ECOTAG_DATA_SCIENTIST";
export const Annotateur = "ECOTAG_ANNOTATEUR";
export const Administateur = "ECOTAG_ADMINISTRATEUR";

const addRole = (roles, role) => {
    if (roles.includes(role)) {
        return;
    }
    if (role === DataScientist || role === Annotateur || role === Administateur) {
        roles.push(role);
    }
}

export const extractRoles = (accessTokenPayload, oidcMode) => {
    const roles = [];
    if (oidcMode === "AXA_FRANCE") {
        if (accessTokenPayload && accessTokenPayload.member_of && accessTokenPayload.member_of.length > 0) {
              accessTokenPayload.forEach((item) => addRole(roles, item));
            if (roles.includes(DataScientist)) {
                addRole(roles, Annotateur);
            } else if (roles.includes(Administateur)) {
                addRole(roles, DataScientist)
                addRole(roles, Annotateur)
            }
        }
    } else {
        roles.push(Annotateur);
        roles.push(DataScientist);
        roles.push(Administateur);
    }
    return roles;
}

const extractDataFromOAuthToken = (idTokenPayload, accessTokenPayload, oidcUser, environment) => ({
    name: getAuthName([idTokenPayload, accessTokenPayload]),
    email: getAuthName([oidcUser, accessTokenPayload], 'email', ''),
    roles: extractRoles(accessTokenPayload, environment.oidc.mode)
});

const withAuthentication = () => Component => props => {
    const {idTokenPayload} = useOidcIdToken();
    const {accessTokenPayload} = useOidcAccessToken();
    const {oidcUser, oidcUserLoadingState} = useOidcUser();
    return <EnvironmentConsumer>{store => <Component {...props}
                                                     user={extractDataFromOAuthToken(idTokenPayload, accessTokenPayload, oidcUser, store.environment)}
                                                     UserLoadingState={oidcUserLoadingState}/>}</EnvironmentConsumer>;
};

export default withAuthentication;

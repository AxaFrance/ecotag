import React from 'react';
import { useOidcIdToken } from '@axa-fr/react-oidc-context';

const NON_CONNECTE = 'Non Connecté';

export const getAuthName = oidcUser => oidcUser ? oidcUser.name : NON_CONNECTE;

export const getAuthEmail = oidcUser => oidcUser? oidcUser.email : '';

export const getAuthRole = oidcUser =>
    oidcUser && oidcUser.member_of ? oidcUser.member_of[0].replace('CN=', '') : '';

export const getAuthUid = oidcUser =>
    oidcUser && oidcUser.axa_uid_racf ? oidcUser.axa_uid_racf : '';

/**
 * MAAM gives us : "member_of": [ "CN=ADMIN"]
 * @param {Object} oidcUser
 */
const extractDataFromOAuthToken = oidcUser => ({
  name: getAuthName(oidcUser),
  email: getAuthEmail(oidcUser),
  role: getAuthRole(oidcUser),
  uid: getAuthUid(oidcUser),
});

const withAuthentication = (useReactOidcFn = useOidcIdToken) => Component => props => {
  const { idToken } = useOidcIdToken();
  return <Component {...props} user={extractDataFromOAuthToken(idToken)} />;
};

export default withAuthentication;

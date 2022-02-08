import React from 'react';
import { get, isEmpty } from 'lodash';
import { useOidcIdToken } from '@axa-fr/react-oidc-context';

const NON_CONNECTE = 'Non Connecté';

export const getAuthName = oidcUser => (!isEmpty(get(oidcUser, 'profile.name')) ? oidcUser.profile.name : NON_CONNECTE);

export const getAuthEmail = oidcUser => (!isEmpty(get(oidcUser, 'profile.email')) ? oidcUser.profile.email : '');

export const getAuthAccessToken = oidcUser => (!isEmpty(get(oidcUser, 'access_token')) ? oidcUser.access_token : '');

export const getAuthRole = oidcUser =>
  !isEmpty(get(oidcUser, 'profile.member_of')) ? oidcUser.profile.member_of[0].replace('CN=', '') : '';

export const getAuthUid = oidcUser =>
  !isEmpty(get(oidcUser, 'profile.axa_uid_racf')) ? oidcUser.profile.axa_uid_racf : '';

/**
 * MAAM gives us : "member_of": [ "CN=ADMIN"]
 * @param {Object} oidcUser
 */
const extractDataFromOAuthToken = oidcUser => ({
  name: getAuthName(oidcUser),
  email: getAuthEmail(oidcUser),
  accessToken: getAuthAccessToken(oidcUser),
  role: getAuthRole(oidcUser),
  uid: getAuthUid(oidcUser),
});

const withAuthentication = (useReactOidcFn = useOidcIdToken) => Component => props => {
  const { idToken } = useOidcIdToken();
  return <Component {...props} user={extractDataFromOAuthToken(idToken)} />;
};

export default withAuthentication;

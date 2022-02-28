import React from 'react';
import {useOidcIdToken, useOidcUser} from '@axa-fr/react-oidc-context';

const NON_CONNECTE = 'Non Connecté';

export const getAuthName = oidcUser => oidcUser ? oidcUser.name : NON_CONNECTE;

export const getAuthEmail = oidcUser => oidcUser? oidcUser.email : '';

export const getAuthRole = oidcUser => {
  if(oidcUser && oidcUser.member_of && oidcUser.member_of.length > 0) { 
   const member =  oidcUser.member_of[0].split(",");
   return member.length > 0 ? member[0].replace('CN=', '') : '';  
  }
}

const extractDataFromOAuthToken = (idTokenPayload, oidcUser) => ({
  name: getAuthName(idTokenPayload),
  email: getAuthEmail(oidcUser),
  role: getAuthRole(oidcUser)
});

const withAuthentication = () => Component => props => {
  const { idTokenPayload } = useOidcIdToken();
  const{ oidcUser } = useOidcUser();
  
  
  return <Component {...props} user={extractDataFromOAuthToken(idTokenPayload, oidcUser)} />;
};

export default withAuthentication;

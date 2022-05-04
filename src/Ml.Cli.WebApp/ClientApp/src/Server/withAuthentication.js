import React from 'react';
import {useOidcIdToken, useOidcUser} from '@axa-fr/react-oidc';

const NON_CONNECTE = 'Non Connecté';

const getAuthName = oidcUser => oidcUser ? oidcUser.name : NON_CONNECTE;

const getAuthEmail = oidcUser => oidcUser? oidcUser.email : '';

export const DataScientist = "ECOTAG_DATA_SCIENTIST";
export const Annotateur = "ECOTAG_ANNOTATEUR";
export const Administateur = "ECOTAG_ADMINISTRATEUR";
    
export const extractRoles = oidcUser => {
    const roles = [];
  if(oidcUser && oidcUser.member_of && oidcUser.member_of.length > 0) { 
   
      oidcUser.member_of.forEach(member => {
          member.split(",").forEach(subMember => {
              if(subMember.startsWith('CN=')){
                  const role = subMember.replace('CN=', '');
                  if(role.includes("ECOTAG_")) {
                      roles.push(role);
                  }
              }
          });
      });
      if(roles.includes(DataScientist)){
          roles.push(Annotateur);
      }
      else if(roles.includes(Administateur)){
          roles.push(DataScientist);
          roles.push(Annotateur);
      }
      
   return roles;  
  }
}

const extractDataFromOAuthToken = (idTokenPayload, oidcUser) => ({
  name: getAuthName(idTokenPayload),
  email: getAuthEmail(oidcUser),
  roles: extractRoles(oidcUser)
});

const withAuthentication = () => Component => props => {
  const { idTokenPayload } = useOidcIdToken();
  const{ oidcUser } = useOidcUser();
  return <Component {...props} user={extractDataFromOAuthToken(idTokenPayload, oidcUser)} />;
};

export default withAuthentication;

import React from 'react';
import {useOidcIdToken, useOidcUser} from '@axa-fr/react-oidc-context';

const NON_CONNECTE = 'Non Connecté';

export const getAuthName = oidcUser => oidcUser ? oidcUser.name : NON_CONNECTE;

export const getAuthEmail = oidcUser => oidcUser? oidcUser.email : '';

    const DataScientist = "ECOTAG_DATA_SCIENTIST";
    const Annoteur = "ECOTAG_ANNOTATEUR";
    const Administateur = "ECOTAG_ADMINISTRATEUR";
    
    
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
          roles.push(Annoteur);
      }
      else if(roles.includes(Administateur)){
          roles.push(DataScientist);
          roles.push(Annoteur);
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

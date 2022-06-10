import React from 'react';
import {useOidcIdToken, useOidcUser} from '@axa-fr/react-oidc';
import { EnvironmentConsumer } from './EnvironmentProvider';

const NON_CONNECTE = 'Non Connecté';

const getAuthName = oidcUser => oidcUser ? oidcUser.name : NON_CONNECTE;

const getAuthEmail = oidcUser => oidcUser? oidcUser.email : '';

export const DataScientist = "ECOTAG_DATA_SCIENTIST";
export const Annotateur = "ECOTAG_ANNOTATEUR";
export const Administateur = "ECOTAG_ADMINISTRATEUR";
    
export const extractRoles = (oidcUser, oidcMode) => {
    const roles = [];
    if(oidcMode === "AXA_FRANCE"){
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
          }
    }else{
        roles.push(Annotateur);
        roles.push(DataScientist);
        roles.push(Annotateur);
    }
  return roles;
}

const extractDataFromOAuthToken = (idTokenPayload, oidcUser, environment) => ({
  name: getAuthName(idTokenPayload),
  email: getAuthEmail(oidcUser),
  roles: extractRoles(oidcUser, environment.oidc.mode)
});

const withAuthentication = () => Component => props => {
  const { idTokenPayload } = useOidcIdToken();
  const{ oidcUser, oidcUserLoadingState } = useOidcUser();
  return <EnvironmentConsumer>{store =><Component {...props} user={extractDataFromOAuthToken(idTokenPayload, oidcUser, store.environment)} UserLoadingState={oidcUserLoadingState} />}</EnvironmentConsumer>;
};

export default withAuthentication;

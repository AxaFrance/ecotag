// Add here trusted domains, access tokens will be send to 
const trustedDomains = {
    default: [#{Spa:Oidc:ServiceWorkerTrustedDomain}#],
    access_token: { domains : [#{Spa:Oidc:ServiceWorkerTrustedDomain}#], showAccessToken: true }
}
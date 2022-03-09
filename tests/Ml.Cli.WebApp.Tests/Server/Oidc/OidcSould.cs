using System.Collections.Generic;
using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Ml.Cli.WebApp.Server.Oidc;
using Xunit;
using static System.String;

namespace Ml.Cli.WebApp.Tests
{
    public class OidcSould
    {
        [Theory]
        [InlineData("CN=ECOTAG_DATA_SCIENTIST,CN=IAM_ECOTAG,OU=applis,O=organisation,DC=ADC,DC=demo-fr,DC=int", "ECOTAG_DATA_SCIENTIST,ECOTAG_ANNOTATEUR")]
        [InlineData("CN=ECOTAG_ANNOTATEUR,CN=IAM_ECOTAG,OU=applis,O=organisation,DC=ADC,DC=demo-fr,DC=int", "ECOTAG_ANNOTATEUR")]
        [InlineData("CN=ECOTAG_ADMINISTRATEUR,CN=IAM_ECOTAG,OU=applis,O=organisation,DC=ADC,DC=demo-fr,DC=int", "ECOTAG_ADMINISTRATEUR,ECOTAG_DATA_SCIENTIST,ECOTAG_ANNOTATEUR")]
        [InlineData("OU=applis,O=organisation,DC=ADC,DC=demo-fr,DC=int", "")]
        public void ReturnProfiles(string memberOf, string expectedRoles)
        {
            IList<Claim> claims = new List<Claim>();
            claims.Add(new Claim(IdentityExtensions.EcotagClaimTypes.MemberOf, memberOf));
            
            var claimsIdentity = new ClaimsIdentity(claims);
            var profiles = claimsIdentity.GetProfiles();
            
            var roles = Join(',', profiles);
            Assert.Equal(expectedRoles, roles);
        }
        
        [Theory]
        [InlineData("openid profile email urn:axa:france:etg urn:axa:france:wac urn:axa:france:entity offline_access", true)]
        [InlineData("openid profile email", false)]
        public void ReturnCheckRequireScopeScope(string scopes, bool expectIsAuthorized)
        {
            var authorizationRequirements = new List<IAuthorizationRequirement>();
            var user = new ClaimsPrincipal();
            user.AddIdentity(new ClaimsIdentity(new List<Claim>(){new Claim("scope", scopes)}));
            
            var authorizationHandlerContext = new AuthorizationHandlerContext(authorizationRequirements, user, null);
            var isAuthorized = ScopeRequirement.IsAuthorized(authorizationHandlerContext, new[] {"urn:axa:france:etg"});
            Assert.Equal(expectIsAuthorized, isAuthorized);
        }
    }
}
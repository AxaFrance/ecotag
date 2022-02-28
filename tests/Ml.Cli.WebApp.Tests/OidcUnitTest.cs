using System.Collections.Generic;
using System.Security.Claims;
using Ml.Cli.WebApp.Server.Oidc;
using Xunit;
using static System.String;

namespace Ml.Cli.WebApp.Tests
{
    public class OidcUnitTest
    {
        [Theory]
        [InlineData("CN=ECOTAG_DATA_SCIENTIST,CN=IAM_ECOTAG,OU=applis,O=organisation,DC=ADC,DC=demo-fr,DC=int", "ECOTAG_DATA_SCIENTIST,ECOTAG_ANNOTATEUR")]
        [InlineData("CN=ECOTAG_ANNOTATEUR,CN=IAM_ECOTAG,OU=applis,O=organisation,DC=ADC,DC=demo-fr,DC=int", "ECOTAG_ANNOTATEUR")]
        [InlineData("CN=ECOTAG_ADMINISTRATEUR,CN=IAM_ECOTAG,OU=applis,O=organisation,DC=ADC,DC=demo-fr,DC=int", "ECOTAG_ADMINISTRATEUR,ECOTAG_DATA_SCIENTIST,ECOTAG_ANNOTATEUR")]
        [InlineData("OU=applis,O=organisation,DC=ADC,DC=demo-fr,DC=int", "")]
        public void GetProfilesShouldReturnProfiles(string memberOf, string expectedRoles)
        {
            IList<Claim> claims = new List<Claim>();
            claims.Add(new Claim(IdentityExtensions.EcotagClaimTypes.MemberOf, memberOf));
            
            var claimsIdentity = new ClaimsIdentity(claims);
            var profiles = claimsIdentity.GetProfiles();
            
            var roles = Join(',', profiles);
            Assert.Equal(expectedRoles, roles);
        }
    }
}
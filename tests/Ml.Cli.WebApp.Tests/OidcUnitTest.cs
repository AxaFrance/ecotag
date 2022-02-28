using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Azure;
using Ml.Cli.FileLoader;
using Ml.Cli.WebApp.Local;
using Ml.Cli.WebApp.Paths;
using Ml.Cli.WebApp.Server.Oidc;
using Moq;
using Xunit;

namespace Ml.Cli.WebApp.Tests
{
    public class OidcUnitTest
    {
        [Fact]
        public void GetProfilesShouldReturnProfiles()
        {
            IList<Claim> claims = new List<Claim>();
            claims.Add(new Claim(IdentityExtensions.EcotagClaimTypes.MemberOf, "CN=ECOTAG_DATA_SCIENTIST,CN=IAM_ECOTAG,OU=applis,O=axafrance,DC=REWACAD,DC=axa-fr,DC=intraxa"));
            
            var claimsIdentity = new ClaimsIdentity(claims);
            var profiles = claimsIdentity.GetProfiles();
            
            
            


        }
    }
}
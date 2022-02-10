using System;
using System.Security.Claims;
using System.Security.Principal;

namespace advalorem.Controllers
{
    namespace AF.AspNetCore.Authorization.Jwt.SiteMinder
    {
        
        public static class ClaimsIdentityExtensions
        {

            public static string GetEmail(this IIdentity identity)
            {
                if (identity == null) throw new ArgumentNullException(nameof(identity));

                if (identity is ClaimsIdentity claimsIdentity)
                    return claimsIdentity.FindFirstValue(
                        "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress");

                return null;
            }

            private static string FindFirstValue(this ClaimsIdentity identity, string claimType)
            {
                if (identity == null) throw new ArgumentNullException(nameof(identity));

                var claim = identity.FindFirst(claimType);

                return claim?.Value;
            }
        }
    }
}
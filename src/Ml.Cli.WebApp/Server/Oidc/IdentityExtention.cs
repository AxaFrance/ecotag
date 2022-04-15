using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using System.Security.Principal;
using System.Text.RegularExpressions;

namespace Ml.Cli.WebApp.Server.Oidc
{
    public static class IdentityExtensions
    {
        private const string ProfilesPatternMatching = @"(?:CN=)([^\,]*)";

        private static readonly Regex ProfileMatcher = new Regex(ProfilesPatternMatching);

        public class EcotagClaimTypes
        {
            public static readonly string MemberOf = "member_of";
            public static readonly string NameIdentifier = "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier";
        }
        
        public static string GetNameIdentifier(this IIdentity identity)
        {
            if (identity == null)
            {
                throw new ArgumentNullException(nameof(identity));
            }

            if (!(identity is ClaimsIdentity claimsIdentity)) return string.Empty;
            
            var sub = claimsIdentity
                .Claims.FirstOrDefault(c => c.Type == EcotagClaimTypes.NameIdentifier);

            return sub?.Value;
        }

        public static ICollection<string> GetProfiles(this IIdentity identity)
        {
            if (identity == null)
            {
                throw new ArgumentNullException(nameof(identity));
            }

            if (!(identity is ClaimsIdentity claimsIdentity)) return new string[0];
            
            const int profileGroupIndex = 1;
            var result = new List<string>();
            foreach (var profile in claimsIdentity
                .Claims
                .Where(c => c.Type == EcotagClaimTypes.MemberOf))
            {
                var matches = ProfileMatcher.Matches(profile.Value);
                result.AddRange(from Match match in matches select match.Groups[profileGroupIndex].Value.Trim());
            }

            if (result.Contains(Roles.DataScientist))
            {
                result.Add(Roles.DataAnnoteur);
            }
            else if (result.Contains(Roles.DataAdministateur))
            {
                result.Add(Roles.DataScientist);
                result.Add(Roles.DataAnnoteur);
            }

            const string iamEcotag = "IAM_ECOTAG";
            if (result.Contains(iamEcotag))
            {
                result.Remove(iamEcotag);
            }

            return result;
        }
    }
}
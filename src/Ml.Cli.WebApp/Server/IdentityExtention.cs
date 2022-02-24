using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using System.Security.Principal;
using System.Text.RegularExpressions;

namespace Ml.Cli.WebApp.Server
{
    public static class IdentityExtensions
    {
        private const string ProfilesPatternMatching = @"(?:CN=)([^\,]*)";

        private static readonly Regex ProfileMatcher = new Regex(ProfilesPatternMatching);

        public class EcotagClaimTypes
        {
            public static readonly string MemberOf = "member_of";
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
            return result;

        }
    }
}
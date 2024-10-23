using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using System.Security.Principal;
using System.Text.RegularExpressions;

namespace AxaGuilDEv.Ecotag.Server.Oidc;

public static class IdentityExtensions
{
    private const string ProfilesPatternMatching = @"(?:CN=)([^\,]*)";

    private static readonly Regex ProfileMatcher = new(ProfilesPatternMatching);

    public static string GetNameIdentifier(this IIdentity identity)
    {
        if (identity == null) throw new ArgumentNullException(nameof(identity));

        if (!(identity is ClaimsIdentity claimsIdentity)) return string.Empty;

        var sub = claimsIdentity
            .Claims.FirstOrDefault(c => c.Type == EcotagClaimTypes.NameIdentifier);

        var nameIdentifier = sub?.Value;
        if (string.IsNullOrEmpty(nameIdentifier))
        {
            nameIdentifier = "computer";
        }
        
        return nameIdentifier;
    }

    public static ICollection<string> GetProfiles(this IIdentity identity)
    {
        if (identity == null) throw new ArgumentNullException(nameof(identity));

        if (!(identity is ClaimsIdentity claimsIdentity)) return new string[0];

        var result = new List<string>();
        foreach (var profile in claimsIdentity
                     .Claims
                     .Where(c => c.Type == EcotagClaimTypes.MemberOf))
        {
            result.AddRole(profile.Value.Trim());
        }

        if (result.Contains(Roles.DataScientist))
        {
            result.AddRole(Roles.DataAnnoteur);
        }
        else if (result.Contains(Roles.DataAdministateur))
        {
            result.AddRole(Roles.DataScientist);
            result.AddRole(Roles.DataAnnoteur);
        }

        return result;
    }

    private static void AddRole(this List<string> roles, string role)
    {
        if (roles.Contains(role))
        {
            return;
        }
        if(role is Roles.DataScientist or Roles.DataAnnoteur or Roles.DataAdministateur )
        {
            roles.Add(role);
        }
    }

    public class EcotagClaimTypes
    {
        public static readonly string MemberOf = "member_of";

        public static readonly string NameIdentifier =
            "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier";
    }
}
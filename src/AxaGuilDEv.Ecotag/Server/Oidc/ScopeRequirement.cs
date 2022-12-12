using System;
using System.Collections.Generic;
using System.Linq;
using Microsoft.AspNetCore.Authorization;

namespace Ml.Cli.WebApp.Server.Oidc;

public static class ScopeRequirement
{
    public static readonly IEnumerable<string> ScopeClaimTypes = new HashSet<string>(StringComparer.OrdinalIgnoreCase)
    {
        "http://schemas.microsoft.com/identity/claims/scope",
        "scope"
    };

    public static bool IsAuthorized(AuthorizationHandlerContext context, params string[] scopes)
    {
        return context.User
            .Claims
            .Where(c => ScopeClaimTypes.Contains(c.Type))
            .SelectMany(c => c.Value.Split(' '))
            .Any(s => scopes.Contains(s, StringComparer.OrdinalIgnoreCase));
    }

    public static AuthorizationPolicyBuilder RequireScope(this AuthorizationPolicyBuilder builder,
        params string[] scopes)
    {
        return builder.RequireAssertion(context => IsAuthorized(context, scopes));
    }
}
using System.Diagnostics.CodeAnalysis;

namespace AxaGuilDEv.Ecotag.Server.Oidc;

[ExcludeFromCodeCoverage]
public class Roles
{
    public const string DataScientist = "ECOTAG_DATA_SCIENTIST";
    public const string DataAnnoteur = "ECOTAG_ANNOTATEUR";
    public const string DataAdministateur = "ECOTAG_ADMINISTRATEUR";
}
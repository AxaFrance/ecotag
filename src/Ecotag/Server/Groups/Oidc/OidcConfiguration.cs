using System.Diagnostics.CodeAnalysis;
using System.Text.Json.Serialization;

namespace AxaGuilDEv.Ecotag.Server.Groups.Oidc;

[method: JsonConstructorAttribute]
public record OidcConfiguration(string userinfo_endpoint);

[JsonSerializable(typeof(OidcConfiguration))]
[JsonSourceGenerationOptions(WriteIndented = false, DefaultIgnoreCondition = JsonIgnoreCondition.WhenWritingNull)]
public partial class OidcConfigurationSerializerContext : JsonSerializerContext;
﻿using System.Diagnostics.CodeAnalysis;
using System.Text.Json.Serialization;

namespace AxaGuilDEv.Ecotag.Server.Groups.Oidc;

[ExcludeFromCodeCoverage]
public record OidcUserInfo(string Email);

[JsonSerializable(typeof(OidcUserInfo))]
[JsonSourceGenerationOptions(WriteIndented = false, DefaultIgnoreCondition = JsonIgnoreCondition.WhenWritingNull, PropertyNameCaseInsensitive = true)]
public partial class OidcUserInfoSerializerContext : JsonSerializerContext;

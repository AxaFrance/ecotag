namespace AxaGuilDEv.MlCli.Extentions.OAuth2ClientCredentials;

public class OAuth2ClientCredentialsOptions : OAuth2ClientCredentialsBaseOptions
{
    public string ProxyAddress { get; set; }

    public string CacheKey => $"{Authority}:{ClientId}:{Scope}";
}
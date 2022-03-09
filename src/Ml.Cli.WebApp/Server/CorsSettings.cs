using System.Diagnostics.CodeAnalysis;

namespace Ml.Cli.WebApp.Server
{
    [ExcludeFromCodeCoverage]
    public class CorsSettings
    {
        public const string Cors = "Cors";
        public string Origins { get; set; }
    }
}
using System.Diagnostics.CodeAnalysis;

namespace Ml.Cli.WebApp.Server.Datasets;

[ExcludeFromCodeCoverage]
public class DatasetsSettings
{
    public string LibreOfficeExePath { get; set; }
    public int LibreOfficeTimout { get; set; }
    public static string Datasets { get; set; } = "Datasets";
}
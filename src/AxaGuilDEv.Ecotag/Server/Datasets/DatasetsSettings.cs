using System.Diagnostics.CodeAnalysis;

namespace Ml.Cli.WebApp.Server.Datasets;

[ExcludeFromCodeCoverage]
public class DatasetsSettings
{
    public string LibreOfficeExePath { get; set; }
    public int LibreOfficeTimeout { get; set; }
    public int? LibreOfficeNumberWorker { get; set; }
    public bool IsBlobTransferActive { get; set; }
    public static string Datasets { get; set; } = "Datasets";
}
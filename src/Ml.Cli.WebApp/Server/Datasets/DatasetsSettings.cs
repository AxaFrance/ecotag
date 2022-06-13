using System;
using System.Diagnostics.CodeAnalysis;

namespace Ml.Cli.WebApp.Server.Datasets;

[ExcludeFromCodeCoverage]
public class DatasetsSettings
{
    public Boolean IsBlobTransferActive { get; set; }
    public static string Datasets { get; set; } = "Datasets";
}
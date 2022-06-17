using System.Collections.Generic;
using System.IO;
using Ml.Cli.WebApp.Server.Datasets.Database;

namespace Ml.Cli.WebApp.Server.Datasets;

public static class FileValidator
{
    public const int Mb = 1048576;
    public const int MaxFileSize = 128;

    public static bool IsFileExtensionValid(string fileName, string datasetType)
    {
        var extension = Path.GetExtension(fileName)?.ToLower();
        if (datasetType == DatasetTypeEnumeration.Image.ToString())
        {
            var imageExtension = new List<string> { ".png", ".jpg", ".jpeg" };
            if (!imageExtension.Contains(extension)) return false;
        }
        else if (datasetType == DatasetTypeEnumeration.Eml.ToString())
        {
            var emlExtension = new List<string> { ".eml" };
            if (!emlExtension.Contains(extension)) return false;
        }
        else if (datasetType == DatasetTypeEnumeration.Document.ToString())
        {
            var emlExtension = new List<string> { ".eml", ".png", ".jpg", ".jpeg", ".tif", ".tiff", ".txt",  ".doc", ".docx", ".xls", ".xlsx", ".ppt", ".pptx", ".pdf", ".rtf", ".odt", ".ods", ".odp", ".zip", ".msg" };
            if (!emlExtension.Contains(extension)) return false;
        }
        else
        {
            var textExtension = new List<string> { ".txt" };
            if (!textExtension.Contains(extension)) return false;
        }

        return true;
    }

    
    public static bool IsFileSizeValid(Stream fileStream)
    {
        return fileStream.Length < MaxFileSize * Mb;
    }
}
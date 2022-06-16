using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.IO;
using System.Text;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Ml.Cli.WebApp.Server;
using Ml.Cli.WebApp.Server.Datasets.Cmd;
using Ml.Cli.WebApp.Server.Datasets.Database;
using Ml.Cli.WebApp.Server.Datasets.Database.FileStorage;
using Org.BouncyCastle.Crypto.Digests;
using Xunit;

namespace Ml.Cli.WebApp.Tests.Server.Datasets;

public class ConvertDatasetShould
{
    [Theory]
    [InlineData("Public", "datasetgood", "Image", "s666666")]
    public async Task Youhou(string classification, string name, string type, string nameIdentifier)
    {
        var filePath = @"C:\Users\A115VC\Desktop\LibreOfficePortable\ecotag import export.docx";
        var filePath2 = @"C:\Users\A115VC\Documents\Permis (3).pptx";
        var inputStream = System.IO.File.OpenRead(filePath2);
        
        await NewMethod(filePath2, inputStream);
    }



}
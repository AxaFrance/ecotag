using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using Ml.Cli.WebApp.Server.Datasets.Database.FileStorage;
using Ml.Cli.WebApp.Server.Projects.Cmd;

namespace Ml.Cli.WebApp.Server.Datasets.Database;

public class DatasetsConvertRepository
{
    private readonly DatasetContext _datasetsContext;
    private readonly IFileService _fileService;
    private readonly DocumentConverterToPdf _documentConverterToPdf;
    private readonly IServiceScopeFactory _serviceScopeFactory;

    public DatasetsConvertRepository(DatasetContext datasetsContext, IFileService fileService, DocumentConverterToPdf documentConverterToPdf, IServiceScopeFactory serviceScopeFactory)
    {
        _datasetsContext = datasetsContext;
        _fileService = fileService;
        _documentConverterToPdf = documentConverterToPdf;
        _serviceScopeFactory = serviceScopeFactory;
    }

     public static IEnumerable<IEnumerable<T>> SplitByChunks<T>(IEnumerable<T> source, int chunkSize)
    {
        return source
            .Select((x, i) => new { Value = x, Index = i })
            .GroupBy(x => x.Index / chunkSize)
            .Select(g => g.Select(x => x.Value));
    }
    public async Task ConvertFileToPdfAsync(string datasetId)
    {
        using var scope = _serviceScopeFactory.CreateScope();
        await using var datasetContext = scope.ServiceProvider.GetService<DatasetContext>();
        
        var dataset = await _datasetsContext.Datasets.FirstOrDefaultAsync(dataset => dataset.Id == new Guid(datasetId));
        if (dataset == null || dataset.Locked == DatasetLockedEnumeration.Locked) return;

        if (dataset.Type != DatasetTypeEnumeration.Document)
        {
            return;
        }

        var filenames = await _datasetsContext.Files.AsNoTracking().Where(f => f.DatasetId == Guid.Parse(datasetId))
            .Select(f => new FileToConvertPdf {Name = f.Name, Id=f.Id }).ToListAsync();
        
        var chunkSize = (filenames.Count / _documentConverterToPdf.LibreOfficeNumberWorker) + 1;
        var chunks = SplitByChunks(filenames, chunkSize);
        var promises = new List<Task>();
        foreach (var chunk in chunks)
        {
            promises.Add( ConvertToPdfAsync(_serviceScopeFactory, chunk.ToList(), dataset.Id));
        }

        Task.WaitAll(promises.ToArray());

        dataset.Locked = DatasetLockedEnumeration.Locked;
        await _datasetsContext.SaveChangesAsync();
    }

    record FileToConvertPdf
    {
        public string Name { get; set; }
        public Guid Id  {get; set; }
    }
    
    public static Stream GenerateStreamFromString(string s)
    {
        var stream = new MemoryStream();
        var writer = new StreamWriter(stream);
        writer.Write(s);
        writer.Flush();
        stream.Position = 0;
        return stream;
    }

    private static async Task ConvertToPdfAsync(IServiceScopeFactory serviceScopeFactory, IList<FileToConvertPdf> filenames, Guid datasetId)
    {
        using var scope = serviceScopeFactory.CreateScope();
        await using var datasetContext = scope.ServiceProvider.GetService<DatasetContext>();
        var fileService = scope.ServiceProvider.GetService<IFileService>();
        var documentConverterToPdf = scope.ServiceProvider.GetService<DocumentConverterToPdf>();
        
        var dataset =  await datasetContext.Datasets.FirstOrDefaultAsync(dataset => dataset.Id == datasetId);
        
        var count = filenames.Count();
        var random = new Random();
        while (count > 0)
        {
            var index = random.Next(0, count);
            var filename = filenames[index];
            filenames.RemoveAt(index);
            count = filenames.Count();
            if (!DatasetsRepository.ExtentionsConvertedToPdf.Contains(Path.GetExtension(filename.Name))) continue;
            var fileNamePdf = $"{filename.Name}.pdf";
            var fileNamePdfError = $"{filename.Name}_pdf.error";
            var isFileExist = await fileService.IsFileExistAsync($"{dataset.BlobUri}/{fileNamePdf}");
            if (isFileExist) continue;
            var isFileErrorExist = await fileService.IsFileExistAsync($"{dataset.BlobUri}/{fileNamePdfError}");
            if (isFileErrorExist) continue;
            var file = await fileService.DownloadAsync($"{dataset.BlobUri}/{filename.Name}");
            if (!file.IsSuccess) continue;
            var streamPdf = await documentConverterToPdf.ConvertAsync(filename.Name, file.Data.Stream);
            if (streamPdf != null)
            {
                streamPdf.Position = 0;
                await fileService.UploadStreamAsync($"{dataset.BlobUri}/{fileNamePdf}", streamPdf);
            }
            else
            {
                var streamTxt = GenerateStreamFromString("ko");
                await fileService.UploadStreamAsync($"{dataset.BlobUri}/{fileNamePdfError}", streamTxt);
            }

            var reservations = await datasetContext.Reservations.Where(r => r.FileId == filename.Id).ToListAsync();
            foreach (var reservationModel in reservations)
            {
                // On retope séléctionnable en priorité les documents parsé
                reservationModel.TimeStamp = 0;
            }

            if (reservations.Count > 0)
            {
                await datasetContext.SaveChangesAsync();
            }
        }
    }
}
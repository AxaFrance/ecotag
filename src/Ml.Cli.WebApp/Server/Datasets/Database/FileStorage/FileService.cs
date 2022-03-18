using System.IO;
using System.Threading.Tasks;
using Azure.Storage.Blobs;
using Azure.Storage.Blobs.Models;
using Microsoft.Extensions.Options;

namespace Ml.Cli.WebApp.Server.Datasets.Database.FileStorage
{
    public class FileService : IFileService
    {
        private readonly IOptions<StorageSettings> _azureStorageOptions;

        public FileService(IOptions<StorageSettings> azureStorageOptions)
        {
            _azureStorageOptions = azureStorageOptions;
        }

        private async Task<BlobContainerClient > CloudBlobContainer(string containerName)
        {
            var connectionString = _azureStorageOptions.Value.ConnectionString;
            var container  = new BlobContainerClient(connectionString, containerName);
            await container.CreateIfNotExistsAsync();
            await container.SetAccessPolicyAsync(PublicAccessType.None);
            return container;
        }

        private async Task<BlobClient> CloudBlockBlob(string containerName, string fileName)
        {
            if (string.IsNullOrEmpty(fileName))
            {
                return null;
            }
            var container = await CloudBlobContainer(containerName);
            var blockBlob = container.GetBlobClient(fileName);
            return blockBlob;
        }

        public async Task UploadStreamAsync(string containerName, string fileName, Stream fileBuffer)
        {
            fileBuffer.Position = 0;
            var cloudBlob = await CloudBlockBlob(containerName, fileName);
            await cloudBlob.UploadAsync(fileBuffer);
        }
        
        public async Task<bool> DeleteAsync(string containerName, string fileName)
        {
            var cloudBlob = await CloudBlockBlob(containerName, fileName);
            return await cloudBlob.DeleteIfExistsAsync();
        }

        public const string FileNameMissing = "FileNameMissing";
        public async Task<ResultWithError<FileDataModel, Error>> DownloadAsync(string containerName, string fileName)
        {
            var cloudBlob = await CloudBlockBlob(containerName, fileName);
            var result = new ResultWithError<FileDataModel, Error>();
            if (cloudBlob == null)
            {
                result.Error = new Error
                {
                    Message = FileNameMissing
                };
                return result;
            }

            var memoryStream = new MemoryStream();
            var downloadStreaming = await cloudBlob.DownloadStreamingAsync();
            memoryStream.Position = 0;

            var fileDataModel = new FileDataModel { Stream = downloadStreaming.Value.Content };
            if (fileDataModel.Stream.Length <= 0)
            {
                fileDataModel.Length = downloadStreaming.Value.Details.ContentLength;
                fileDataModel.Name = fileName;
            }

            result.Data = fileDataModel;
            return result;
        }
    }

    public record FileDataModel
    {
        public string Name { get; set; }
        public Stream Stream { get; set; }
        public long Length { get; set; }
    };
}

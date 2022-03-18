namespace Ml.Cli.WebApp.Server.Datasets
{
    
    public class GetDatasetFile
    {
        public string Id { get; set; }
        public string FileName { get; set; }
        public long Size { get; set; }
        public string ContentType { get; set; }
    }
    
}
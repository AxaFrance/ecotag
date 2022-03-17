namespace Ml.Cli.WebApp.Server.Datasets
{
    
    public class GetDatasetFile
    {
        public string Id { get; set; }
        public string FileName { get; set; }
        public long Size { get; set; }
        public string ContentType { get; set; }
    }
    
    public class EcotagFileWithBytes
    {
        public string Id { get; set; }
        
        public string FileName { get; set; }
        public int Size { get; set; }
        public string ContentType { get; set; }
        
        public string DatasetId { get; set; }
        public byte[] Bytes { get; set; }
    }
}
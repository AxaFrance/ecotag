using System;
using System.Collections;
using System.Collections.Generic;

namespace Ml.Cli.WebApp.Server.Datasets
{
    
    public class DatasetInput
    {
        public string Name { get; set; }
        public string Type { get; set; }
        public string Classification { get; set; }
        public string GroupId { get; set; }
    }
    
    public class DatasetForList
    {
        public string Id { get; set; }
        public string Name { get; set; }
        public string Type { get; set; }
        public string Classification { get; set; }
        public long CreateDate { get; set; }
        public bool IsLocked { get; set; } = false;
        public int NumberFiles { get; set; }
    }
    
    public class GetDataset
    {
        public string Id { get; set; }
        public string GroupId { get; set; }
        public string Name { get; set; }
        public string Type { get; set; }
        public string Classification { get; set; }
        public long CreateDate { get; set; }
        public bool IsLocked { get; set; } = false;
        public IList<GetDatasetFile> Files { get; set; } = new List<GetDatasetFile>();
    }
    
    public class GetDatasetInfo
    {
        public string Id { get; set; }
        public string GroupId { get; set; }
        public string Name { get; set; }
        public bool IsLocked { get; set; } = false;
    }
}

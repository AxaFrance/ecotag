using System.Collections.Generic;

namespace Ml.Cli.JobDataset
{
    public class DatasetResult
    {
        public DatasetResult(string fileName, string fileDirectory, string imageDirectory, string frontDefaultStringsMatcher, string annotations)
        {
            FileName = fileName;
            FileDirectory = fileDirectory;
            ImageDirectory = imageDirectory;
            FrontDefaultStringsMatcher = frontDefaultStringsMatcher;
            Annotations = annotations;
        }

        public string FileName;
        public string FileDirectory;
        public string ImageDirectory;
        public string FrontDefaultStringsMatcher;
        public string Annotations;
    }
}

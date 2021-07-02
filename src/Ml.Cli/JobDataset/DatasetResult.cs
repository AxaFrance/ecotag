using System.Collections.Generic;

namespace Ml.Cli.JobDataset
{
    public class DatasetResult
    {
        public DatasetResult(string fileName, string fileDirectory, string imageDirectory, IDictionary<string, Annotation> annotations)
        {
            FileName = fileName;
            FileDirectory = fileDirectory;
            ImageDirectory = imageDirectory;
            Annotations = annotations;
        }

        public string FileName;
        public string FileDirectory;
        public string ImageDirectory;
        public IDictionary<string, Annotation> Annotations;
    }
}

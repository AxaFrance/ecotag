using System.Collections.Generic;

namespace Ml.Cli.JobDataset
{
    public class DatasetFileResult
    {
        public DatasetFileResult(string datasetLocation, string annotationType, string configuration, IList<DatasetResult> content)
        {
            DatasetLocation = datasetLocation;
            AnnotationType = annotationType;
            Configuration = configuration;
            Content = content;
        }

        public string DatasetLocation { get; }
        public string AnnotationType { get; }
        public string Configuration { get; }
        // ReSharper disable once UnusedAutoPropertyAccessor.Global
        public IList<DatasetResult> Content { get; }
    }
}

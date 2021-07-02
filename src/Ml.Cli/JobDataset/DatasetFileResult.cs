using System.Collections.Generic;

namespace Ml.Cli.JobDataset
{
    public class DatasetFileResult
    {
        public DatasetFileResult(string datasetLocation, IList<DatasetResult> content)
        {
            DatasetLocation = datasetLocation;
            Content = content;
        }

        public string DatasetLocation { get; }
        // ReSharper disable once UnusedAutoPropertyAccessor.Global
        public IList<DatasetResult> Content { get; }
    }
}

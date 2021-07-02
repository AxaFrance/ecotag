using System.Collections.Generic;

namespace Ml.Cli.JobCompare
{
    public class FileResult
    {
        public FileResult(string compareLocation, IList<CompareResult> content)
        {
            CompareLocation = compareLocation;
            Content = content;
        }

        public string CompareLocation { get; }

        // ReSharper disable once MemberCanBePrivate.Global : public required to write the content in a local file
        public IList<CompareResult> Content
        {
            // ReSharper disable once UnusedAutoPropertyAccessor.Global : get accessor required to write the Content variable in a local file
            get;
        }
    }
}

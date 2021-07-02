using System;
using System.Collections.Generic;

namespace Ml.Cli
{
    public partial class Program
    {
        public class HttpResult
        {
            public Uri Url { get; set; }
            public string FileName { get; set; }
            public string FileDirectory { get; set; }
            public string ImageDirectory { get; set; }
            public string FrontDefaultStringsMatcher { get; set; }
            public int StatusCode { get; set; }
            public string Body { get; set; }
            public List<KeyValuePair<string, IEnumerable<string>>> Headers { get; set; }
            public long TimeMs { get; set; }
            public long TicksAt { get; set; }
        }
    }
}

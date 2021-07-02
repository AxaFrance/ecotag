    namespace Ml.Cli.JobCompare
    {
        public class CompareResult
        {
            public string FileName { get; set; }
            public Program.HttpResult Left { get; set; }
            public Program.HttpResult Right { get; set; }
        }
    }

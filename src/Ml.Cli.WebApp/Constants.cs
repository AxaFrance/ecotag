namespace Ml.Cli.WebApp
{
    public static class Constants
    {
        
        public static class Separators
        {
            public const string CommaSeparator = ",";
            public const string DotSeparator = ".";
            public const string UnderscoreSeparator = "_";
        }

        public static class Extensions
        {
            public const string JsonExtension = ".json";
        }

        public static class StringContent
        {
            public const string NullString = "null";
        }
        
        public static class ErrorMessages
        {
            public const string BasePathArgumentError = "The base path argument is unspecified.";
            public const string ComparesPathsArgumentError = "Compare repositories paths unspecified.";
        }
    }
}
namespace Ml.Cli.WebApp.BasePath
{
    public interface IBasePath
    {
        bool IsPathSecure(string path);
    }
}

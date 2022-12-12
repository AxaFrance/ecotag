namespace Ml.Cli.PathManager;

public interface IPathValidatorHelper
{
    public bool IsPathValid(string path, string taskId);
}
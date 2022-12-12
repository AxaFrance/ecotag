namespace AxaGuilDEv.MlCli.JobDataset;

public class DatasetResult
{
    public string Annotations;
    public string FileDirectory;

    public string FileName;
    public string FrontDefaultStringsMatcher;
    public string ImageDirectory;

    public DatasetResult(string fileName, string fileDirectory, string imageDirectory,
        string frontDefaultStringsMatcher, string annotations)
    {
        FileName = fileName;
        FileDirectory = fileDirectory;
        ImageDirectory = imageDirectory;
        FrontDefaultStringsMatcher = frontDefaultStringsMatcher;
        Annotations = annotations;
    }
}
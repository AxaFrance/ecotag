using AxaGuilDEv.MlCli.PathManager;

namespace AxaGuilDEv.Ecotag.Local.Paths;

public class DatasetsPaths
{
    public DatasetsPaths(string paths)
    {
        Paths = PathAdapter.AdaptPathForCurrentOs(paths);
    }

    public string Paths { get; }
}
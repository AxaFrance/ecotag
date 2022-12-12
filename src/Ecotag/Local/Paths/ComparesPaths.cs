using AxaGuilDEv.MlCli.PathManager;

namespace AxaGuilDEv.Ecotag.Local.Paths;

public class ComparesPaths
{
    public ComparesPaths(string paths)
    {
        Paths = PathAdapter.AdaptPathForCurrentOs(paths);
    }

    public string Paths { get; }
}
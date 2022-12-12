namespace Ml.Cli.WebApp.Server.Datasets.Database;

public enum DatasetLockedEnumeration
{
    None = 0,
    Pending = 1,
    Locked = 2,
    LockedAndWorkInProgress = 3
}
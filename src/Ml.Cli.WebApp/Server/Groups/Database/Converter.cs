namespace Ml.Cli.WebApp.Server.Groups.Database;

public static class Converter
{
    public static GroupDataModel ToGroupDataModel(this GroupModel groupModel)
    {
        return new GroupDataModel
        {
            Id = groupModel.Id.ToString(),
            Name = groupModel.Name
        };
    }
}
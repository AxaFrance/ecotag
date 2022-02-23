using System.Linq;

namespace Ml.Cli.WebApp.Server.Groups.Database.Group;

public static class Converter
{
    public static GroupDataModel ToGroupDataModel(this GroupModel groupModel)
    {
        return new GroupDataModel
        {
            Id = groupModel.Id.ToString(),
            Name = groupModel.Name,
            Users = groupModel.GroupUsers?.Select(groupUser => groupUser.UserId.ToString()).ToList()
        };
    }
}
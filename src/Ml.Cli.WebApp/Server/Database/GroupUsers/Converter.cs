using Ml.Cli.WebApp.Server.Groups.Database;

namespace Ml.Cli.WebApp.Server.Database.GroupUsers;

public static class Converter
{
    public static GroupUsersDataModel ToGroupUsersDataModel(this GroupUsersModel groupUsersModel)
    {
        return new GroupUsersDataModel
        {
            Id = groupUsersModel.Id.ToString(),
            GroupId = groupUsersModel.GroupId.ToString(),
            UserId = groupUsersModel.UserId.ToString()
        };
    }
}
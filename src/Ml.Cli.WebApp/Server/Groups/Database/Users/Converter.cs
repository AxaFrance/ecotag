using System.Linq;
using Ml.Cli.WebApp.Server.Database.Users;

namespace Ml.Cli.WebApp.Server.Groups.Database.Users;

public static class Converter
{
    public static UserDataModel ToUserDataModel(this UserModel userModel)
    {
        return new UserDataModel
        {
            Id = userModel.Id.ToString(),
            Email = userModel.Email,
            Subject = userModel.Subject,
            GroupIds = userModel.GroupUsers.Select(groupUsers => groupUsers.GroupId.ToString()).ToList()
        };
    }
    
    public static ListUserDataModel ToListUserDataModel(this UserModel userModel)
    {
        return new ListUserDataModel
        {
            Id = userModel.Id.ToString(),
            Email = userModel.Email,
            Subject = userModel.Subject
        };
    }
}
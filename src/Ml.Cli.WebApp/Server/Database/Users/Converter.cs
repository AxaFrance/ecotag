using Ml.Cli.WebApp.Server.Groups.Database;

namespace Ml.Cli.WebApp.Server.Database.Users;

public static class Converter
{
    public static UserDataModel ToUserDataModel(this UserModel userModel)
    {
        return new UserDataModel
        {
            Id = userModel.Id.ToString(),
            Email = userModel.Email
        };
    }
}
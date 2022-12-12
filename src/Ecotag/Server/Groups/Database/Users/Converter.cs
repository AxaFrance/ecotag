using System.Linq;

namespace AxaGuilDEv.Ecotag.Server.Groups.Database.Users;

public static class Converter
{
    public static UserDataModel ToUserDataModel(this UserModel userModel)
    {
        return new UserDataModel
        {
            Id = userModel.Id.ToString(),
            Email = userModel.Email,
            NameIdentifier = userModel.NameIdentifier
        };
    }

    public static UserDataModelWithGroups ToUserDataModelWithGroups(this UserModel userModel)
    {
        return new UserDataModelWithGroups
        {
            Id = userModel.Id.ToString(),
            Email = userModel.Email,
            NameIdentifier = userModel.NameIdentifier,
            GroupIds = userModel.GroupUsers.Select(groupUsers => groupUsers.GroupId.ToString()).ToList()
        };
    }

    public static UserDataModel ToListUserDataModel(this UserModel userModel)
    {
        return new UserDataModel
        {
            Id = userModel.Id.ToString(),
            Email = userModel.Email,
            NameIdentifier = userModel.NameIdentifier
        };
    }
}
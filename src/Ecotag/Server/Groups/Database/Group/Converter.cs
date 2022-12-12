using System.Linq;

namespace AxaGuilDEv.Ecotag.Server.Groups.Database.Group;

public static class Converter
{
    public static GroupDataModel ToGroupDataModel(this GroupModel groupModel)
    {
        return new GroupDataModel
        {
            Id = groupModel.Id.ToString(),
            Name = groupModel.Name,
            UserIds = groupModel.GroupUsers?.Select(groupUser => groupUser.UserId.ToString()).ToList()
        };
    }
}
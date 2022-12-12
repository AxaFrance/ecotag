using System.Collections.Generic;

namespace AxaGuilDEv.Ecotag.Server.Groups.Database.Users;

public class UserDataModelWithGroups
{
    public string Id { get; set; }
    public string Email { get; set; }
    public string NameIdentifier { get; set; }
    public List<string> GroupIds { get; set; }
}
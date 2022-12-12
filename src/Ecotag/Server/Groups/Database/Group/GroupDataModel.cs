using System.Collections.Generic;

namespace AxaGuilDEv.Ecotag.Server.Groups.Database.Group;

public class GroupDataModel
{
    public string Id { get; set; }
    public string Name { get; set; }
    public long CreateDate { get; set; }
    public IList<string> UserIds { get; set; }
}
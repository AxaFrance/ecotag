using System.Collections.Generic;

namespace AxaGuilDEv.Ecotag.Server.Groups;

public class Group
{
    public string Id { get; set; }
    public string Name { get; set; }
    public List<User> Users { get; set; }
}
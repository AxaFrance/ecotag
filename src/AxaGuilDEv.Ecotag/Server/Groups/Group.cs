using System.Collections.Generic;

namespace Ml.Cli.WebApp.Server.Groups;

public class Group
{
    public string Id { get; set; }
    public string Name { get; set; }
    public List<User> Users { get; set; }
}
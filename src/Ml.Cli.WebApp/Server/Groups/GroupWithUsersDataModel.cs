using System.Collections.Generic;
using Ml.Cli.WebApp.Server.Database.Users;

namespace Ml.Cli.WebApp.Server.Groups;

public class GroupWithUsersDataModel
{
    public string Id { get; set; }
    public string Name { get; set; }
    public List<UserDataModel> Users { get; set; }
}
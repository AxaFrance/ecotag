using System;
using System.ComponentModel.DataAnnotations.Schema;
using Ml.Cli.WebApp.Server.Database.Users;
using Ml.Cli.WebApp.Server.Groups.Database.Group;

namespace Ml.Cli.WebApp.Server.Groups.Database.GroupUsers;

[Table("T_GroupUsers", Schema = "sch_ECOTAG")]
public class GroupUsersModel
{
    [Column("GRP_Id")]
    public Guid GroupId { get; set; }
    
    public GroupModel Group { get; set; }
    
    [Column("USR_Id")]
    public Guid UserId { get; set; }
    
    public UserModel User { get; set; }
}
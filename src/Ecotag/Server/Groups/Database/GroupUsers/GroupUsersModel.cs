using System;
using System.ComponentModel.DataAnnotations.Schema;
using AxaGuilDEv.Ecotag.Server.Groups.Database.Group;
using AxaGuilDEv.Ecotag.Server.Groups.Database.Users;

namespace AxaGuilDEv.Ecotag.Server.Groups.Database.GroupUsers;

[Table("T_GroupUsers", Schema = "sch_ECOTAG")]
public class GroupUsersModel
{
    [Column("GRP_Id")] public Guid GroupId { get; set; }

    public GroupModel Group { get; set; }

    [Column("USR_Id")] public Guid UserId { get; set; }

    public UserModel User { get; set; }
}
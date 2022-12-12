using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using AxaGuilDEv.Ecotag.Server.Groups.Database.GroupUsers;

namespace AxaGuilDEv.Ecotag.Server.Groups.Database.Users;

[Table("T_User", Schema = "sch_ECOTAG")]
public class UserModel
{
    [Key] [Column("USR_Id")] public Guid Id { get; set; }

    [Column("USR_Email")] [EmailAddress] public string Email { get; set; }

    [Column("USR_NameIdentifier")]
    [Required]
    public string NameIdentifier { get; set; }

    public List<GroupUsersModel> GroupUsers { get; set; }
}
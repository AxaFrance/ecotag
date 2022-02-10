using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Ml.Cli.WebApp.Server.Groups.Database;

[Table("T_UserGroup", Schema = "sch_etg")]
public class UserGroupModel
{
    [Key]
    [Column("UGP_GroupId")]
    public Guid GroupId { get; set; }
    
    [Column("UGP_UserId")]
    public Guid UserId { get; set; }
}
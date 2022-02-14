using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Ml.Cli.WebApp.Server.Groups.Database;

[Table("T_GroupUsers", Schema = "sch_etg")]
public class GroupUsersModel
{
    [Key]
    [Column("GPU_Id")]
    public Guid Id { get; set; }
    
    [Column("GRP_Id")]
    public Guid GroupId { get; set; }
    
    [Column("USR_Id")]
    public Guid UserId { get; set; }
}
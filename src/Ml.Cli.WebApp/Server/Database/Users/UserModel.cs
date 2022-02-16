using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Ml.Cli.WebApp.Server.Database.Users;

[Table("T_User", Schema = "sch_etg")]
public class UserModel
{
    [Key]
    [Column("USR_Id")]
    public Guid Id { get; set; }
    
    [Column("USR_Email")]
    public string Email { get; set; }
}
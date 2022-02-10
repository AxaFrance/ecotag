using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Ml.Cli.WebApp.Server.Groups.Database;

[Table("T_Group", Schema = "sch_etg")]
public class GroupModel
{
    [Key]
    [Column("GRP_Id")]
    public Guid Id { get; set; }
    
    [Column("GRP_Name")]
    [MaxLength(16)]
    [MinLength(3)]
    public string Name { get; set; }
}
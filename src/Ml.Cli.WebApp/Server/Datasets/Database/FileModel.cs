using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Ml.Cli.WebApp.Server.Groups.Database.GroupUsers;

namespace Ml.Cli.WebApp.Server.Datasets.Database;

[Table("T_File", Schema = "sch_ECOTAG")]
public class FileModel
{
    [Key]
    [Column("FLE_Id")]
    public Guid Id { get; set; }
    
    [Column("FLE_Path")]
    [MaxLength(512)]
    [MinLength(1)]
    public string Path { get; set; }
    
    [Column("FLE_Size")]
    public int Size { get; set; }
    
    [Column("FLE_ContentType")]
    [MaxLength(16)]
    [MinLength(3)]
    public string ContentType { get; set; }

    [Column("FLE_CreatorNameIdentifier")]
    [MaxLength(32)]
    [MinLength(1)]
    public string CreatorNameIdentifier { get; set; }
    
    [Column("USR_Id")]
    public Guid UserId { get; set; }

    [Column("FLE_CreateDate")]
    public long CreateDate { get; set; }
    
    [Column("DTS_Id")]
    public Guid DatasetId { get; set; }
    
    public DatasetModel Dataset { get; set; }
}
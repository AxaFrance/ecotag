using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Ml.Cli.WebApp.Server.Datasets.Database;

[Table("T_Dataset", Schema = "sch_ECOTAG")]
public class DatasetModel
{
    [Key]
    [Column("DTS_Id")]
    public Guid Id { get; set; }
    
    [Column("DTS_Name")]
    [MaxLength(16)]
    [MinLength(3)]
    public string Name { get; set; }
    
    [Column("DTS_Type")]
    public DatasetTypeEnumeration Type { get; set; }
    
    [Column("DTS_Classification")]
    [MaxLength(16)]
    [MinLength(3)]
    public DatasetClassificationEnumeration Classification { get; set; }
    
    [Column("GRP_GroupId")]
    public Guid GroupId { get; set; }
    
    [Column("DTS_CreatorNameIdentifier")]
    [MaxLength(32)]
    [MinLength(1)]
    public string CreatorNameIdentifier { get; set; }
    
    [Column("DTS_CreateDate")]
    public long CreateDate { get; set; }
    
    public List<FileModel> Files { get; set; }
}
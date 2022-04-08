using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Ml.Cli.WebApp.Server.Datasets.Database.Annotations;

[Table("T_Reservation", Schema = "sch_ECOTAG")]
public class ReservationModel
{
    [Key] 
    [Column("RSV_Id")] 
    public Guid Id { get; set; }
    
    [Column("FLE_FileId")] 
    public Guid FileId { get; set; }
    
    public FileModel File { get; set; }
    
    [Column("RSV_TimeStamp")]
    public long TimeStamp { get; set; }
    
    [Column("PRJ_ProjectId")]
    public Guid ProjectId { get; set; }

}
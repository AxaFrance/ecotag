using System;
using System.Collections.Generic;

namespace Ml.Cli.WebApp.Server.Projects
{
    public class Project
    {
        public string Id { get; set; }
        public string Name { get; set; }
        public string DataSetId { get; set; }
        public string GroupId { get; set; }
        public string Classification { get; set; }
        public int NumberCrossAnnotation { get; set; }
        public DateTime CreateDate { get; set; }
        public string TypeAnnotation { get; set; }
        public List<Label> Labels { get; set; }
        
        
    }

    public class ProjectReservation
    {
        public IList<Reserve> Reservations { get; set; } = new List<Reserve>();
    }
    
    public class ProjectList : Project
    {
        public int NumberTagTagged { get; set; }
    }
    
    public class Reserve
    {
        public string FileId { get; set; }
        public long TimeStamp { get; set; }
        
    }

    public class Annotations
    {
        
    }

    public class Annotation 
    {
        
    }
    
}

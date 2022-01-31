using System;
using System.Collections.Generic;

namespace Ml.Cli.WebApp.Server.Projects
{

    public class ReserveAnnotation
    {
        public string Id { get; set; }
        public string ExpectedOutputJson { get; set; }
    }
    public class ReserveOutput
    {
        public string FileId{ get; set; }
        public string FileName{ get; set; }
        public long TimeStamp { get; set; }
       
        public ReserveAnnotation Annotation { get; set; }
        
    }
    
}

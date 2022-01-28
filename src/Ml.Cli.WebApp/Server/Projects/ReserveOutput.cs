using System;
using System.Collections.Generic;

namespace Ml.Cli.WebApp.Server.Projects
{
    public class ReserveOutput
    {
        public string FileId{ get; set; }
        public string FileName{ get; set; }
        public long TimeStamp { get; set; }

        public IList<Annotation> Annotations { get; set; } 
    }
    
}

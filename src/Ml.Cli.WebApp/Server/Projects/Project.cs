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
        public int NumberTagToDo { get; set; }
        public DateTime CreateDate { get; set; }
        public string TypeAnnotation { get; set; }
        public List<Label> Labels { get; set; }
    }
    
    public class ProjectList : Project
    {
        public int NumberTagTagged { get; set; }
    }
}

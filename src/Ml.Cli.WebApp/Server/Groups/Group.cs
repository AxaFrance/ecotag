using System.Collections.Generic;

namespace Ml.Cli.WebApp.Server.Groups
{
    public class Group
    {
        public string Id { get; set; }
        public string Name { get; set; }
        public List<User> Users { get; set; }

        public override bool Equals(object obj)
        {
            if (obj == null) return false;
            Group objAsGroup = obj as Group;
            if (objAsGroup == null) return false;
            else return Equals(objAsGroup);
        }
        public override int GetHashCode()
        {
            return Id.GetHashCode();
        }
        public bool Equals(Group other)
        {
            if (other == null) return false;
            return (this.Id.Equals(other.Id));
        }
        public int CompareTo(Group compareGroup)
        {
            // A null value means that this object is greater.
            if (compareGroup == null)
                return 1;

            else
                return this.Id.CompareTo(compareGroup.Id);
        }
    }
}

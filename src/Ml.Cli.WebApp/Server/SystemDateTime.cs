using System;

namespace Ml.Cli.WebApp.Server;

public class SystemDateTime : IDateTime
{
    public DateTime Now
    {
        get { return DateTime.Now; }
    }
}
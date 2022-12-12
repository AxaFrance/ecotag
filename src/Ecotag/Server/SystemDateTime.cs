using System;

namespace AxaGuilDEv.Ecotag.Server;

public class SystemDateTime : IDateTime
{
    public DateTime Now => DateTime.Now;
}
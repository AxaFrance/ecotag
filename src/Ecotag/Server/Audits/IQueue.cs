using System;
using System.Threading.Tasks;

namespace AxaGuilDEv.Ecotag.Server.Audits;

public interface IQueue
{
    Task PublishAsync(string type, object message);
    void Subscribe(string type, Func<string, string, Task<bool>> func);
}
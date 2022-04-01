using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace Ml.Cli.WebApp.Server.Audits;

class Subscriber
{
    public string Type { get; set; }
    public Func<string, string, Task<bool>> CallbackAsync { get; set; }
        
}

public class Queue : IQueue
{
    private IList<Subscriber> subscribers = new List<Subscriber>();

    public async Task PublishAsync(string type, string message)
    {
        foreach (var subscriber in subscribers)
        {
            if (subscriber.Type == type)
            {
                await subscriber.CallbackAsync(type, message);
            }
        }
    }
        
    public void Subscribe(string type, Func<string, string, Task<bool>> func)
    {
        var subscriber = new Subscriber()
        {
            Type = type,
            CallbackAsync = func,
        };
        subscribers.Add(subscriber);

    }

}
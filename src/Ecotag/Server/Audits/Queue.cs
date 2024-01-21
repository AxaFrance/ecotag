using System;
using System.Collections.Generic;
using System.Text.Json;
using System.Threading.Tasks;

namespace AxaGuilDEv.Ecotag.Server.Audits;

public class Subscriber
{
    public string Type { get; set; }
    public Func<string, string, Task<bool>> CallbackAsync { get; set; }
}

public class Queue : IQueue
{
    private readonly IList<Subscriber> _subscribers = new List<Subscriber>();

    public async Task PublishAsync(string type, object message)
    {
        var messageJson = JsonSerializer.Serialize(message);
        foreach (var subscriber in _subscribers)
            if (subscriber.Type == type)
                await subscriber.CallbackAsync(type, messageJson);
    }

    public void Subscribe(string type, Func<string, string, Task<bool>> func)
    {
        var subscriber = new Subscriber
        {
            Type = type,
            CallbackAsync = func
        };
        _subscribers.Add(subscriber);
    }
}
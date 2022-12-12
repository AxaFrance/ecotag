using System;
using System.IO;
using System.Threading.Tasks;
using AxaGuilDEv.MlCli.FileLoader;
using Jint;
using Newtonsoft.Json.Linq;

namespace AxaGuilDEv.MlCli.JobScript;

public static class ScriptManager
{
    public static async Task<string> ExecScript(string path, string script, IFileLoader fileLoader)
    {
        var engine = new Engine()
            .SetValue("log", new Action<object>(Console.WriteLine));
        if (!Path.IsPathRooted(path)) path = Path.GetFullPath(path);
        var json = JToken.Parse(await fileLoader.LoadAsync(path));
        var jsonResult = (JObject)json;
        var body = (string)jsonResult.Property("Body");
        engine.SetValue("rawBodyInput", body);
        engine.Execute(script);
        var jsValue = engine.GetValue("rawBodyOutput");
        return jsValue.AsString();
    }
}
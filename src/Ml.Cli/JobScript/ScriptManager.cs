using System;
using System.IO;
using System.Threading.Tasks;
using Jint;
using Ml.Cli.FileLoader;
using Newtonsoft.Json.Linq;

namespace Ml.Cli.JobScript
{
    public static class ScriptManager
    {
        public static async Task<string> ExecScript(string path, string script, IFileLoader fileLoader)
        {
            var engine = new Engine()
                .SetValue("log", new Action<object>(Console.WriteLine));
            if (!Path.IsPathRooted(path))
            {
                path = Path.GetFullPath(path);
            }
            var json = JToken.Parse(await fileLoader.LoadAsync(path));
            var jsonResult = (JObject) json;
            var body = (string) jsonResult.Property("Body");
            engine.SetValue("rawBodyInput", body);
            engine.Execute(script);
            var jsValue = engine.GetValue("rawBodyOutput");
            return jsValue.AsString();
        }
    }
}
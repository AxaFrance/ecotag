using System;
using System.IO;
using System.Threading.Tasks;
using Microsoft.ClearScript.V8;
using Ml.Cli.FileLoader;
using Newtonsoft.Json.Linq;

namespace Ml.Cli.JobScript
{
    public static class ScriptManager
    {
        // ReSharper disable once MemberCanBePrivate.Global : Class used by the V8ScriptEngine, must be public
        public static class EngineConsole
        {
            // ReSharper disable once InconsistentNaming : JavaScript naming convention
            // ReSharper disable once UnusedMember.Global
            public static void log(string value) => Console.WriteLine(value);
        }
        
        public static async Task<string> ExecScript(string path, string script, IFileLoader fileLoader)
        {
            var engine = new V8ScriptEngine();
            engine.AddHostType("console", typeof(EngineConsole));
            if (!Path.IsPathRooted(path))
            {
                path = Path.GetFullPath(path);
            }
            var json = JToken.Parse(await fileLoader.LoadAsync(path));
            var jsonResult = (JObject) json;
            var body = (string) jsonResult.Property("Body");
            engine.Script.rawBodyInput = body;
            engine.Execute(script);
            return (string) engine.Script.rawBodyOutput;
        }
    }
}
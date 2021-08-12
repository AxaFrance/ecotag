using System;
using System.IO;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Ml.Cli.FileLoader;
using Ml.Cli.WebApp.BasePath;
using Newtonsoft.Json;

namespace Ml.Cli.WebApp.Controllers
{
    public class CompareToken
    {
        public string FileName { get; set; }
        public Ml.Cli.Program.HttpResult Left { get; set; }
        public Ml.Cli.Program.HttpResult Right { get; set; }

        public CompareToken(string fileName, Ml.Cli.Program.HttpResult left, Ml.Cli.Program.HttpResult right)
        {
            FileName = fileName;
            Left = left;
            Right = right;
        }
    }

    public class CompareContent
    {
        public string CompareLocation { get; set; }

        [JsonProperty(PropertyName = "Content")]
        public CompareToken[] JsonTokens { get; set; }

        public CompareContent(string compareLocation, CompareToken[] array)
        {
            CompareLocation = compareLocation;
            JsonTokens = array;
        }
    }

    public class ItemInfo
    {
        public string FileName { get; set; }
        public Cli.Program.HttpResult Left { get; set; }
        public Cli.Program.HttpResult Right { get; set; }

        public ItemInfo(string fileName, Cli.Program.HttpResult left, Cli.Program.HttpResult right)
        {
            FileName = fileName;
            Left = left;
            Right = right;
        }
    }

    public class EditorContent
    {
        public string CompareLocation { get; set; }
        public string FileDirectory { get; set; }
        public string Content { get; set; }

        public EditorContent(string compareLocation, string content, string fileDirectory)
        {
            CompareLocation = compareLocation;
            Content = content;
            FileDirectory = fileDirectory;
        }
    }

    [ApiController]
    [Route("api/compares")]
    public class ComparesController : ControllerBase
    {
        private readonly IFileLoader _fileLoader;
        private readonly IBasePath _basePath;

        public ComparesController(IFileLoader fileLoader, IBasePath basePath)
        {
            _fileLoader = fileLoader;
            _basePath = basePath;
        }

        private static EditorContent ReformatEditorContent(EditorContent data)
        {
            var content = JsonConvert.DeserializeObject<ItemInfo>(data.Content);
            dynamic contentBodyLeft = JsonConvert.DeserializeObject(content.Left.Body);
            if (contentBodyLeft != null)
            {
                content.Left.Body = JsonConvert.SerializeObject(contentBodyLeft);
            }

            dynamic contentBodyRight = JsonConvert.DeserializeObject(content.Right.Body);
            if (contentBodyRight != null)
            {
                content.Right.Body = JsonConvert.SerializeObject(contentBodyRight);
            }

            data.Content = JsonConvert.SerializeObject(content, Formatting.Indented);
            return data;
        }

        private async Task SaveInCompareFileAsync(EditorContent data)
        {
            var file = await _fileLoader.ReadAllTextInFileAsync(data.CompareLocation);
            var fileContent = JsonConvert.DeserializeObject<CompareContent>(file);
            var foundToken = Array.Find(fileContent.JsonTokens,
                token => token.FileName == Path.GetFileName(data.FileDirectory));
            if (foundToken != null)
            {
                var httpResult = JsonConvert.DeserializeObject<ItemInfo>(data.Content);
                foundToken.Left.Body = httpResult.Left.Body;
                foundToken.Right.Body = httpResult.Right.Body;
            }

            var result = JsonConvert.SerializeObject(fileContent, Formatting.Indented);

            await _fileLoader.WriteAllTextInFileAsync(data.CompareLocation, result);
        }

        [HttpPost("save")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        public async Task<IActionResult> SaveCompare([FromBody] EditorContent data)
        {
            if (data == null || data.Content == null || data.CompareLocation == null || data.FileDirectory == null)
            {
                return BadRequest();
            }

            if (!_basePath.IsPathSecure(data.CompareLocation) || !_basePath.IsPathSecure(data.FileDirectory))
            {
                return BadRequest();
            }

            try
            {
                data = ReformatEditorContent(data);
                await SaveInCompareFileAsync(data);
                return Ok();
            }
            catch
            {
                return BadRequest();
            }
        }
    }
}

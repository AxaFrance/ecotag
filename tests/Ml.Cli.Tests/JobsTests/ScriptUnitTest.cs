using System.IO;
using System.Collections.Generic;
using System.Threading.Tasks;
using Microsoft.Extensions.Logging;
using Ml.Cli.FileLoader;
using Ml.Cli.JobScript;
using Ml.Cli.PathManager;
using Moq;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using Xunit;

namespace Ml.Cli.Tests.JobsTests
{
    public class ScriptUnitTest
    {
        [Fact]
        public async Task ShouldExecuteScript()
        {
            var json = "{\"Url\":\"Url Path\",\"FileName\":\"{FileName}.pdf\",\"FileDirectory\":\"File Directory Path\",\"StatusCode\":200,\"Body\":\"{\\\"analysis\\\":[{\\\"elements\\\":[{\\\"document_type\\\":\\\"nouveau_permis_recto\\\",\\\"confidence_rate\\\":99.9,\\\"status\\\":\\\"OK\\\",\\\"status_reason\\\":null,\\\"url_file_new_recto_zone\\\":\\\"https://url1\\\",\\\"url_file_new_recto_orientation\\\":\\\"https://url2\\\",\\\"license_delivery_country\\\":\\\"France\\\",\\\"birthdate\\\":{\\\"raw_value\\\":\\\"raw_birthdate\\\",\\\"value\\\":\\\"value_birthdate\\\",\\\"confidence_rate\\\":87.66666666666667},\\\"birthplace\\\":{\\\"raw_value\\\":\\\"raw_birthplace\\\",\\\"value\\\":\\\"value_birthplace\\\",\\\"confidence_rate\\\":87.66666666666667},\\\"license_number\\\":{\\\"raw_value\\\":\\\"raw_license_number\\\",\\\"value\\\":\\\"value_license_number\\\",\\\"confidence_rate\\\":100},\\\"mrz\\\":{\\\"raw_value\\\":\\\"raw_mrz\\\",\\\"value\\\":\\\"value_mrz\\\",\\\"confidence_rate\\\":100},\\\"license_validity_date\\\":{\\\"raw_value\\\":\\\"raw_license_validity_date\\\",\\\"value\\\":\\\"value_license_validity_date\\\",\\\"confidence_rate\\\":100},\\\"firstname\\\":{\\\"raw_value\\\":\\\"raw_firstname\\\",\\\"value\\\":\\\"value_firstname\\\",\\\"confidence_rate\\\":92.25},\\\"license_category_list\\\":{\\\"raw_value\\\":\\\"raw_license_category_list\\\",\\\"value\\\":\\\"value_license_category_list\\\",\\\"confidence_rate\\\":92},\\\"lastname\\\":{\\\"raw_value\\\":\\\"raw_lastname\\\",\\\"value\\\":\\\"value_lastname\\\",\\\"confidence_rate\\\":100},\\\"license_delivery_date\\\":{\\\"raw_value\\\":\\\"raw_license_delivery_date\\\",\\\"value\\\":\\\"value_license_delivery_date\\\",\\\"confidence_rate\\\":87},\\\"license_delivery_place\\\":{\\\"raw_value\\\":\\\"raw_pr\u00E9fet\\\",\\\"value\\\":\\\"value_pr\u00E9fet\\\",\\\"confidence_rate\\\":90},\\\"document_id\\\":\\\"0\\\"}],\\\"page\\\":1,\\\"status\\\":\\\"OK\\\"}],\\\"version\\\":1}\",\"Headers\":[],\"TimeMs\":9069,\"TicksAt\":637453731518053200}";

            var fileLoader = new Mock<IFileLoader>();
            fileLoader.Setup(mock => mock.CreateDirectory(It.IsAny<string>()));
            fileLoader.Setup(mock => mock.EnumerateFiles(It.IsAny<string>(), It.IsAny<string>())).Returns(new List<string> {"toto_pdf.json"});
            fileLoader.Setup(mock => mock.WriteAllTextInFileAsync(It.IsAny<string>(), It.IsAny<string>()));
            fileLoader.Setup(mock => mock.ReadAllTextInFileAsync(It.IsAny<string>())).ReturnsAsync(json);
            fileLoader.Setup(mock => mock.LoadAsync(It.IsAny<string>())).Returns(Task.FromResult(json));

            var logger = Mock.Of<ILogger<TaskScript>>();
            
            var inputTask = new ScriptTask(
            "script",
            "unique_id",
            true,
            PathAdapter.AdaptPathForCurrentOs("baseDirectory/ml/raw_ap/input"),
            PathAdapter.AdaptPathForCurrentOs("baseDirectory/ml/raw_ap/output"),
            "try { \n\tvar dataBody = JSON.parse(rawBodyInput);\n\tconst result = [];\n\tdataBody.analysis.forEach(anal => {\n\t\tanal.elements.forEach(el => {\n\t\t\tlet new_data = null;\n\t\t\tif(el.document_type == \"nouveau_permis_recto\") {\n\t\t\t\tnew_data = {\n\t\t\t\t\tfirstname : el.firstname.value,\n\t\t\t\t\tlastname: el.lastname.value,\n\t\t\t\t\tbirthdate: el.birthdate.value,\n\t\t\t\t\tlicense_validity_date: el.license_validity_date.value,\n\t\t\t\t\tdocument_type:el.document_type,\n\t\t\t\t\tdocument_id: el.document_id,\n\t\t\t\t\tpage: anal.page,\n\t\t\t\t};\n\t\t\t\t\n\t\t\t\tresult.push(new_data);\n\t\t\t} \n\t\t\tif(el.document_type == \"nouveau_permis_verso\") {\n\t\t\t\tnew_data = {\n\t\t\t\t\tdocument_type:el.document_type,\n\t\t\t\t\tcategoryB: null,\n\t\t\t\t\tdocument_id: el.document_id,\n\t\t\t\t\tpage: anal.page,\n\t\t\t\t};\n\t\t\t\tel.category_table.forEach(ct => {\n\t\t\t\t\tif(ct.category === \"B\" && ct.license_procurement_date){\n\t\t\t\t\t\tnew_data.categoryB = ct.license_procurement_date.value;\n\t\t\t\t\t}\n\t\t\t\t})\n\t\t\t\tresult.push(new_data);\n\t\t\t}\n\t\t\tif(el.document_type == \"ancien_permis_recto\") {\n\t\t\t\tnew_data = {\n\t\t\t\t\tfirstname : el.firstname.value,\n\t\t\t\t\tlastname: el.lastname.value,\n\t\t\t\t\tbirthdate: el.birthdate.value,\n\t\t\t\t\tcategoryB: null,\n\t\t\t\t\tdocument_id: el.document_id,\n\t\t\t\t\tpage: anal.page,\n\t\t\t\t};\n\t\t\t\tel.category_table.forEach(ct => {\n\t\t\t\t\tif(ct.category === \"B\" && ct.license_procurement_date){\n\t\t\t\t\t\tnew_data.categoryB = ct.license_procurement_date.value;\n\t\t\t\t\t}\n\t\t\t\t})\n\t\t\t\tresult.push(new_data);\n\t\t\t}\n\t\t});\n\t});\n\trawBodyOutput = JSON.stringify(result.sort(function(a, b) {\n\t\treturn a.page - b.page;\n\t}));\n} catch(ex) {\n\tconsole.WriteLine(\"Plantage parsing right\");\n\tconsole.WriteLine(ex.toString());\n\trawBodyOutput = rawBodyInput;\n}"
            );

            var script = new TaskScript(fileLoader.Object, logger);

            await script.FormatCallapiAsync(inputTask);
            
            fileLoader.Verify(mock => mock.WriteAllTextInFileAsync(PathAdapter.AdaptPathForCurrentOs(Path.Combine(inputTask.OutputDirectory, "toto_pdf.json")), It.IsAny<string>()), Times.Once);
        }

        [Fact]
        public void ShouldInitialize()
        {
            var jsonContent = "{\"type\": \"script\",\"id\": \"script_task\",\"enabled\": true,\"fileDirectory\": \"licenses/output\",\"outputDirectory\": \"licenses/scripts\",\"script\": \"try{ console.WriteLine('Write your JS code on this attribute (not necessarily in a try-catch block).') } catch(ex){ console.WriteLine(ex.toString) }\"}";
            var jObject = JObject.Parse(jsonContent);
            var pathValidatorHelper = new Mock<IPathValidatorHelper>();

            var scriptResult = Initializer.CreateTask(jObject, "script", false, true, "baseDirectory", "1",
                pathValidatorHelper.Object);
            var expectedScriptResult = new ScriptTask(
                "script",
                "1",
                false,
                PathAdapter.AdaptPathForCurrentOs("baseDirectory/licenses/output"),
                PathAdapter.AdaptPathForCurrentOs("baseDirectory/licenses/scripts"),
                "try{ console.WriteLine('Write your JS code on this attribute (not necessarily in a try-catch block).') } catch(ex){ console.WriteLine(ex.toString) }"
            );
            Assert.Equal(JsonConvert.SerializeObject(expectedScriptResult), JsonConvert.SerializeObject(scriptResult));
        }
    }
}
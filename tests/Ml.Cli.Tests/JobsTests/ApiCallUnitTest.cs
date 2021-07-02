using System;
using System.Collections.Generic;
using System.IO;
using System.Net.Http;
using System.Threading.Tasks;
using Microsoft.Extensions.Logging;
using Ml.Cli.FileLoader;
using Ml.Cli.JobApiCall;
using Ml.Cli.JobApiCall.FileHandler;
using Moq;
using Moq.Contrib.HttpClient;
using Xunit;

namespace Ml.Cli.Tests.JobsTests
{
    public class ApiCallUnitTest
    {
        
        [Fact]
        public async Task ApiCallShouldCallApi()
        {
            var handler = new Mock<HttpMessageHandler>();
            var factory = handler.CreateClientFactory();
            
            Mock.Get(factory).Setup(x => x.CreateClient("unique_id"))
                .Returns(() =>
                {
                    var client = handler.CreateClient();
                    handler.SetupAnyRequest()
                        .ReturnsResponse("{\"response\":\"youhou\"}", "application/json");
                    return client;
                });
            
            var logger = Mock.Of<ILogger<TaskApiCall>>();
            
            var fileLoader = new Mock<IFileLoader>();
            fileLoader.Setup(foo => foo.CreateDirectory(It.IsAny<string>()));
            fileLoader.Setup(foo => foo.FileExists(It.IsAny<string>())).Returns(false);
            fileLoader.Setup(foo => foo.WriteAllTextInFileAsync(It.IsAny<string>(), It.IsAny<string>()));
            fileLoader.Setup(foo => foo.EnumerateFiles(It.IsAny<string>(), It.IsAny<string>())).Returns(new List<string> {"toto.pdf"});
            fileLoader.Setup(foo => foo.OpenRead(It.IsAny<string>())).Returns(Mock.Of<Stream>());
            var fileHandler = new Mock<IFileHandler>();
            
            var apiCallFiles = new ApiCallFiles(factory, fileLoader.Object, fileHandler.Object, logger);
            var apiCall = new TaskApiCall(factory, apiCallFiles, fileLoader.Object, logger);
            
            var uri = new Uri("https://url");

            await apiCall.ApiCallAsync(new Callapi(
                "callapi", 
                "unique_id",
                true, 
                @"C:\ml\raw_ap\input",
                @"C:\ml\raw_ap\outputJsons",
                @"C:\ml\raw_ap\outputImages",
                @"C:\ml\raw_ap\outputDirInputs",
                @"C:\ml\raw_ap\outputDirInputs",
                "",
                "",
                false,
                false,
                false,
                uri,
                false,
                1, 1));
            
            
            fileLoader.Verify(mock => mock.WriteAllTextInFileAsync( @"C:\ml\raw_ap\outputJsons\toto_pdf.json", It.IsAny<string>()), Times.Once());
        }

        [Fact]
        public async Task ApiCallShouldSaveJsonElements()
        {
            var jsonContent =
                "{\"Url\":\"Url Path\",\"FileName\":\"{FileName}.pdf\",\"FileDirectory\":\"File Directory Path\",\"StatusCode\":200,\"Body\":\"{\\\"analysis\\\":[{\\\"elements\\\":[{\\\"document_type\\\":\\\"ancien_permis_recto\\\",\\\"confidence_rate\\\":99.62,\\\"status\\\":\\\"OK\\\",\\\"status_reason\\\":null,\\\"url_file_old_recto_zone\\\":\\\"https://url_path_old_recto_zone\\\",\\\"output_old_recto_zone\\\":{\\\"id\\\":\\\"id_output_old_recto_zone\\\"},\\\"input_old_recto_zone\\\":{\\\"zones\\\":[{\\\"label\\\":\\\"ancien_permis_verso\\\",\\\"confidence\\\":0.9991827607154846,\\\"coordinates\\\":{\\\"xmin\\\":194,\\\"ymin\\\":22,\\\"xmax\\\":948,\\\"ymax\\\":1406},\\\"file_id\\\":\\\"file_id\\\",\\\"document_id\\\":\\\"0\\\"}]},\\\"url_file_old_recto_orientation\\\":\\\"https://url_path_old_recto_orientation\\\",\\\"license_delivery_country\\\":\\\"country\\\",\\\"category_table\\\":[{\\\"license_procurement_date\\\":{\\\"raw_value\\\":\\\"raw_license_procurement_date\\\",\\\"value\\\":\\\"license_procurement_date\\\",\\\"confidence_rate\\\":87},\\\"category\\\":\\\"B1\\\"},{\\\"license_procurement_date\\\":{\\\"raw_value\\\":\\\"raw_license_procurement_date\\\",\\\"value\\\":\\\"license_procurement_date\\\",\\\"confidence_rate\\\":69},\\\"category\\\":\\\"B\\\"},{\\\"license_procurement_date\\\":{\\\"raw_value\\\":\\\"raw_license_procurement_date\\\",\\\"value\\\":\\\"license_procurement_date\\\",\\\"confidence_rate\\\":73},\\\"category\\\":\\\"A1\\\"}],\\\"birthdate\\\":{\\\"raw_value\\\":\\\"raw_birthdate\\\",\\\"value\\\":null,\\\"confidence_rate\\\":90,\\\"output_old_birthdate\\\":{\\\"ocr\\\":\\\"ocr_value\\\",\\\"conf\\\":86.33333333333333},\\\"input_old_birthdate\\\":{\\\"id\\\":\\\"id_input_old_birthdate\\\",\\\"settings\\\":{\\\"lang\\\":\\\"lang_value\\\",\\\"config\\\":\\\"--oem 1 --psm 13\\\",\\\"type\\\":\\\"ocr\\\"}}},\\\"birthplace\\\":{\\\"raw_value\\\":\\\"raw_birthplace\\\",\\\"value\\\":\\\"birthplace\\\",\\\"confidence_rate\\\":90},\\\"home_address\\\":{\\\"raw_value\\\":\\\"raw_home_address\\\",\\\"value\\\":\\\"home_address\\\",\\\"confidence_rate\\\":84.33333333333333},\\\"firstname\\\":{\\\"raw_value\\\":\\\"raw_firstname\\\",\\\"value\\\":\\\"firstname\\\",\\\"confidence_rate\\\":84.33333333333333},\\\"lastname\\\":{\\\"raw_value\\\":\\\"raw_lastname\\\",\\\"value\\\":\\\"lastname\\\",\\\"confidence_rate\\\":80.66666666666667},\\\"license_delivery_place\\\":{\\\"raw_value\\\":\\\"raw_license_delivery_place\\\",\\\"value\\\":\\\"license_delivery_place\\\",\\\"confidence_rate\\\":87.5},\\\"license_number\\\":{\\\"raw_value\\\":\\\"raw_license_number\\\",\\\"value\\\":\\\"license_number\\\",\\\"confidence_rate\\\":70},\\\"license_delivered_by\\\":{\\\"raw_value\\\":\\\"raw_license_delivered_by\\\",\\\"value\\\":\\\"license_delivered_by\\\",\\\"confidence_rate\\\":83.85714285714286},\\\"license_delivery_date\\\":{\\\"raw_value\\\":\\\"raw_license_delivery_date\\\",\\\"value\\\":\\\"license_delivery_date\\\",\\\"confidence_rate\\\":91},\\\"additional_name\\\":{\\\"raw_value\\\":null,\\\"value\\\":null,\\\"confidence_rate\\\":0},\\\"document_id\\\":\\\"0\\\"}],\\\"page\\\":0,\\\"status\\\":\\\"OK\\\"}],\\\"version\\\":\\\"1.0.0-alpha-opencv-rev.574\\\"}\",\"Headers\":[],\"TimeMs\":9069,\"TicksAt\":637453731518053200}";
            var inputResult1 = "{\r\n  \"zones\": [\r\n    {\r\n      \"label\": \"ancien_permis_verso\",\r\n      \"confidence\": 0.9991827607154846,\r\n      \"coordinates\": {\r\n        \"xmin\": 194,\r\n        \"ymin\": 22,\r\n        \"xmax\": 948,\r\n        \"ymax\": 1406\r\n      },\r\n      \"file_id\": \"file_id\",\r\n      \"document_id\": \"0\"\r\n    }\r\n  ]\r\n}";
            var inputResult2 = "{\r\n  \"id\": \"id_input_old_birthdate\",\r\n  \"settings\": {\r\n    \"lang\": \"lang_value\",\r\n    \"config\": \"--oem 1 --psm 13\",\r\n    \"type\": \"ocr\"\r\n  }\r\n}";
            var outputResult1 = "{\r\n  \"id\": \"id_output_old_recto_zone\"\r\n}";
            var outputResult2 = "{\r\n  \"ocr\": \"ocr_value\",\r\n  \"conf\": 86.33333333333333\r\n}";
            var handler = new Mock<HttpMessageHandler>();
            var factory = handler.CreateClientFactory();
            
            Mock.Get(factory).Setup(x => x.CreateClient("unique_id")).Returns(() =>
            {
                var client = handler.CreateClient();
                handler.SetupRequest(HttpMethod.Get, "https://url_path_old_recto_zone").ReturnsResponse(new byte[] {1});
                handler.SetupRequest(HttpMethod.Get, "https://url_path_old_recto_orientation").ReturnsResponse(new byte[] {1});
                return client;
            });
            

            var apiCallFilesLogger = Mock.Of<ILogger<ApiCallFiles>>();
            
            var fileLoader = new Mock<IFileLoader>();
            fileLoader.Setup(foo => foo.CreateDirectory(It.IsAny<string>()));
            fileLoader.Setup(foo => foo.FileExists(It.IsAny<string>())).Returns(false);
            fileLoader.Setup(foo => foo.WriteAllTextInFileAsync(It.IsAny<string>(), It.IsAny<string>()));
            fileLoader.Setup(foo => foo.WriteAllBytesOfFileAsync(It.IsAny<string>(), It.IsAny<byte[]>()));
            var fileHandler = new Mock<IFileHandler>();
            fileHandler.Setup(foo => foo.SetFileName(It.IsAny<string>(), fileLoader.Object)).Returns((string val, IFileLoader loader) => val);    //In this test, there is no duplicates; therefore, the function would return the passed parameter
            
            var apiCallFiles = new ApiCallFiles(factory, fileLoader.Object, fileHandler.Object, apiCallFilesLogger);

            var uri = new Uri("https://url");
            
            var inputTask = new Callapi(
                "callapi",
                "unique_id",
                true,
                @"C:\ml\raw_ap\input",
                @"C:\ml\raw_ap\outputJsons",
                @"C:\ml\raw_ap\outputImages",
                @"C:\ml\raw_ap\outputDirInputs",
                @"C:\ml\raw_ap\outputDirOutputs",
                "",
                "",
                true,
                true,
                true,
                uri,
                false,
                1, 1
            );

            await apiCallFiles.ApiCallFilesAsync("test", jsonContent, inputTask);
            
            fileLoader.Verify(mock => mock.WriteAllBytesOfFileAsync(@"C:\ml\raw_ap\outputImages\test\url_file_old_recto_zone.png", It.IsAny<byte[]>()));
            fileLoader.Verify(mock => mock.WriteAllBytesOfFileAsync(@"C:\ml\raw_ap\outputImages\test\url_file_old_recto_orientation.png", It.IsAny<byte[]>()));
            fileLoader.Verify(mock => mock.WriteAllTextInFileAsync(@"C:\ml\raw_ap\outputDirInputs\input_old_recto_zone.json", inputResult1));
            fileLoader.Verify(mock => mock.WriteAllTextInFileAsync(@"C:\ml\raw_ap\outputDirInputs\input_old_birthdate.json", inputResult2));
            fileLoader.Verify(mock => mock.WriteAllTextInFileAsync(@"C:\ml\raw_ap\outputDirOutputs\output_old_recto_zone.json", outputResult1));
            fileLoader.Verify(mock => mock.WriteAllTextInFileAsync(@"C:\ml\raw_ap\outputDirOutputs\output_old_birthdate.json", outputResult2));
        }

        [Fact]
        public void ApiShouldCreateFileName()
        {
            var path = @"C:\ml\test.png";
            var fileHandler = new FileHandler();
            
            var fileLoader = new Mock<IFileLoader>();
            fileLoader.Setup(foo => foo.FileExists(@"C:\ml\test.png")).Returns(true);
            
            var result = fileHandler.SetFileName(path, fileLoader.Object);
            Assert.Equal(@"C:\ml\test_1.png", result);
        }
    }
}

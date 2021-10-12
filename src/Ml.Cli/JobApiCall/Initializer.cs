using System;
using Ml.Cli.Extensions.Http.OAuth2ClientCredentials;
using Ml.Cli.Extensions.OAuth2ClientCredentials;
using Microsoft.Extensions.DependencyInjection;
using Ml.Cli.PathManager;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;

namespace Ml.Cli.JobApiCall
{
    public class Initializer
    {
        public static Callapi CreateTask(JObject jObject, string type, bool tokenEnabled, bool isBaseDirectoryValid,
            string baseDirectory, string taskId, IServiceCollection services, IPathValidatorHelper pathValidatorHelper)
        {
            var tokenEnabledSave = (bool) (jObject["enabledSaveImages"] ?? false);
            var tokenEnabledSaveInputs = (bool) (jObject["enabledSaveInputs"] ?? false);
            var tokenEnabledSaveOutputs = (bool) (jObject["enabledSaveOutputs"] ?? false);
            var tokenSortByFileType = (bool) (jObject["sortByFileType"] ?? true);
            var frontDefaultStringMatcher =
                jObject.Property("frontDefaultStringsMatcher", StringComparison.Ordinal) != null;
            var downloadStringsMatcher = jObject.Property("downloadStringsMatcher", StringComparison.Ordinal) != null;
            var outputImages = jObject.Property("outputDirectoryImages", StringComparison.Ordinal) != null;
            var outputDirInputs = jObject.Property("outputDirectoryInputs", StringComparison.Ordinal) != null;
            var outputDirOutputs = jObject.Property("outputDirectoryOutputs", StringComparison.Ordinal) != null;

            if ((string) jObject.Property("outputDirectoryJsons") == "")
            {
                throw new Exception($"Task Id: {taskId} - Output Directory for Jsons of task is unspecified");
            }

            if (tokenEnabledSave && !outputImages)
            {
                throw new Exception(
                    $"Task Id : {taskId} - enabledSaveImages attribute is true but outputDirectoryImages is unspecified");
            }

            if (tokenEnabledSaveInputs && !outputDirInputs)
            {
                throw new Exception(
                    $"Task Id : {taskId} - enabledSaveInputs attribute is true but outputDirectoryInputs is unspecified");
            }

            if (tokenEnabledSaveOutputs && !outputDirOutputs)
            {
                throw new Exception(
                    $"Task Id : {taskId} - enabledSaveOutputs attribute is true but outputDirectoryOutputs is unspecified");
            }

            var uri = (Uri) jObject.Property("url");
            var outputDirectoryImages = SetOutputDirs(jObject, outputImages, "outputDirectoryImages",
                isBaseDirectoryValid, baseDirectory, taskId, pathValidatorHelper);
            var outputDirectoryInputs = SetOutputDirs(jObject, outputDirInputs, "outputDirectoryInputs",
                isBaseDirectoryValid,
                baseDirectory, taskId, pathValidatorHelper);
            var outputDirectoryOutputs = SetOutputDirs(jObject, outputDirOutputs, "outputDirectoryOutputs",
                isBaseDirectoryValid, baseDirectory, taskId, pathValidatorHelper);
            var frontDefaultStringsMatcherResult = frontDefaultStringMatcher
                ? (string) jObject.Property("frontDefaultStringsMatcher")
                : "";
            var downloadStringsMatcherResult =
                downloadStringsMatcher ? (string) jObject.Property("downloadStringsMatcher") : "";

            var numberIteration =
                jObject.ContainsKey("numberIteration") ? (int) jObject.Property("numberIteration") : 1;
            var numberParallel = jObject.ContainsKey("numberParallel") ? (int) jObject.Property("numberParallel") : 1;

            if (!jObject.ContainsKey("Authorization"))
            {
                services.AddHttpClient(taskId);
            }
            else
            {
                var Authorization = jObject.Property("Authorization").Value;
                var oAuth2ClientCredentialsOptions =
                    JsonConvert.DeserializeObject<OAuth2ClientCredentialsOptions>(Authorization.ToString());
                services.AddHttpClient(taskId)
                    .AddOAuth2ClientCredentialsMessageHandler(oAuth2ClientCredentialsOptions);
            }

            return new Callapi(
                type,
                taskId,
                tokenEnabled,
                PropertyHelper.SetProperty(jObject, "fileDirectory", isBaseDirectoryValid, baseDirectory, taskId,
                    pathValidatorHelper),
                PropertyHelper.SetProperty(jObject, "outputDirectoryJsons", isBaseDirectoryValid, baseDirectory,
                    taskId, pathValidatorHelper),
                outputDirectoryImages,
                outputDirectoryInputs,
                outputDirectoryOutputs,
                frontDefaultStringsMatcherResult,
                downloadStringsMatcherResult,
                tokenEnabledSave,
                tokenEnabledSaveInputs,
                tokenEnabledSaveOutputs,
                uri,
                tokenSortByFileType,
                numberIteration,
                numberParallel
            );
        }

        private static string SetOutputDirs(JObject jObject, bool isDirSpecified, string name,
            bool isBaseDirectoryValid, string baseDirectory, string taskId, IPathValidatorHelper pathValidatorHelper)
        {
            return isDirSpecified
                ? PropertyHelper.SetProperty(jObject, name, isBaseDirectoryValid, baseDirectory, taskId,
                    pathValidatorHelper)
                : "";
        }
    }
}
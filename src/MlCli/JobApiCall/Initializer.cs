using System;
using System.Net;
using System.Net.Http;
using AxaGuilDEv.MlCli.Extentions.Http.OAuth2ClientCredentials;
using AxaGuilDEv.MlCli.Extentions.OAuth2ClientCredentials;
using AxaGuilDEv.MlCli.PathManager;
using Microsoft.Extensions.DependencyInjection;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;

namespace AxaGuilDEv.MlCli.JobApiCall;

public class Initializer
{
    public static Callapi CreateTask(JObject jObject, string type, bool tokenEnabled, bool isBaseDirectoryValid,
        string baseDirectory, string taskId, IServiceCollection services, IPathValidatorHelper pathValidatorHelper)
    {
        var tokenEnabledSave = (bool)(jObject["enabledSaveImages"] ?? false);
        var tokenEnabledSaveInputs = (bool)(jObject["enabledSaveInputs"] ?? false);
        var tokenEnabledSaveOutputs = (bool)(jObject["enabledSaveOutputs"] ?? false);
        var tokenSortByFileType = (bool)(jObject["sortByFileType"] ?? true);
        var frontDefaultStringMatcher =
            jObject.Property("frontDefaultStringsMatcher", StringComparison.Ordinal) != null;
        var downloadStringsMatcher = jObject.Property("downloadStringsMatcher", StringComparison.Ordinal) != null;
        var outputImages = jObject.Property("outputDirectoryImages", StringComparison.Ordinal) != null;
        var outputDirInputs = jObject.Property("outputDirectoryInputs", StringComparison.Ordinal) != null;
        var outputDirOutputs = jObject.Property("outputDirectoryOutputs", StringComparison.Ordinal) != null;

        if ((string)jObject.Property("outputDirectoryJsons") == "")
            throw new Exception($"Task Id: {taskId} - Output Directory for Jsons of task is unspecified");

        if (tokenEnabledSave && !outputImages)
            throw new Exception(
                $"Task Id : {taskId} - enabledSaveImages attribute is true but outputDirectoryImages is unspecified");

        if (tokenEnabledSaveInputs && !outputDirInputs)
            throw new Exception(
                $"Task Id : {taskId} - enabledSaveInputs attribute is true but outputDirectoryInputs is unspecified");

        if (tokenEnabledSaveOutputs && !outputDirOutputs)
            throw new Exception(
                $"Task Id : {taskId} - enabledSaveOutputs attribute is true but outputDirectoryOutputs is unspecified");

        var uri = (Uri)jObject.Property("url");
        var outputDirectoryImages = SetOutputDirs(jObject, outputImages, "outputDirectoryImages",
            isBaseDirectoryValid, baseDirectory, taskId, pathValidatorHelper);
        var outputDirectoryInputs = SetOutputDirs(jObject, outputDirInputs, "outputDirectoryInputs",
            isBaseDirectoryValid,
            baseDirectory, taskId, pathValidatorHelper);
        var outputDirectoryOutputs = SetOutputDirs(jObject, outputDirOutputs, "outputDirectoryOutputs",
            isBaseDirectoryValid, baseDirectory, taskId, pathValidatorHelper);
        var frontDefaultStringsMatcherResult = frontDefaultStringMatcher
            ? (string)jObject.Property("frontDefaultStringsMatcher")
            : "";
        var downloadStringsMatcherResult =
            downloadStringsMatcher ? (string)jObject.Property("downloadStringsMatcher") : "";

        var numberIteration =
            jObject.ContainsKey("numberIteration") ? (int)jObject.Property("numberIteration") : 1;

        var numberRetryOnHttp500 =
            jObject.ContainsKey("numberRetryOnHttp500") ? (int)jObject.Property("numberRetryOnHttp500") : 0;
        var delayOn500 =
            jObject.ContainsKey("delayOn500") ? (int)jObject.Property("delayOn500") : 5000;
        var isSaveResultOnError =
            jObject.ContainsKey("isSaveResultOnError") ? (bool)jObject.Property("isSaveResultOnError") : true;
        var stopAfterNumberFiles =
            jObject.ContainsKey("stopAfterNumberFiles") ? (int?)jObject.Property("stopAfterNumberFiles") : null;
        var chunkByNumberPart =
            jObject.ContainsKey("chunkByNumberPart") ? (int?)jObject.Property("chunkByNumberPart") : null;
        var chunkIndex =
            jObject.ContainsKey("chunkIndex") ? (int?)jObject.Property("chunkIndex") : null;

        var numberParallel = jObject.ContainsKey("numberParallel") ? (int)jObject.Property("numberParallel") : 1;
        var defaultTargetFileMode = !jObject.ContainsKey("isDefaultTargetFileMode") || (bool)jObject.Property("isDefaultTargetFileMode");
        var waitTimeMsBetweenRequest = jObject.ContainsKey("waitTimeMsBetweenRequest")
            ? (int)jObject.Property("waitTimeMsBetweenRequest")
            : 0;

        try
        {
            if (!jObject.ContainsKey("Authorization"))
            {
                services.AddHttpClient(taskId).ConfigurePrimaryHttpMessageHandler(() => new HttpClientHandler
                {
                    ClientCertificateOptions = ClientCertificateOption.Manual,
                    ServerCertificateCustomValidationCallback =
                        (httpRequestMessage, cert, cetChain, policyErrors) => true,
                    DefaultProxyCredentials = CredentialCache.DefaultCredentials
                });
            }
            else
            {
                var Authorization = jObject.Property("Authorization").Value;
                var oAuth2ClientCredentialsOptions =
                    JsonConvert.DeserializeObject<OAuth2ClientCredentialsOptions>(Authorization.ToString());
                services.AddHttpClient(taskId)
                    .AddOAuth2ClientCredentialsMessageHandler(oAuth2ClientCredentialsOptions)
                    .ConfigurePrimaryHttpMessageHandler(() => new HttpClientHandler
                    {
                        ClientCertificateOptions = ClientCertificateOption.Manual,
                        ServerCertificateCustomValidationCallback =
                            (httpRequestMessage, cert, cetChain, policyErrors) => true,
                        DefaultProxyCredentials = CredentialCache.DefaultCredentials
                    });
            }
        }
        catch (Exception e)
        {
            Console.WriteLine(e);
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
            numberParallel,
            waitTimeMsBetweenRequest,
            numberRetryOnHttp500,
            delayOn500,
            isSaveResultOnError,
            stopAfterNumberFiles,
            chunkByNumberPart,
            chunkIndex,
            defaultTargetFileMode
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
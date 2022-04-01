using System;
using System.Threading.Tasks;
using JsonDiffPatchDotNet;
using Microsoft.Extensions.DependencyInjection;
using Ml.Cli.WebApp.Server.Audits.Database;
using Newtonsoft.Json;

namespace Ml.Cli.WebApp.Server.Audits;

public record AuditDataModel
{
    public string Id { get; set; }
    public string Data { get; set; }
    public string Type { get; set; }
    public string Author { get; set; }
}

public class Audit
{

    public string Id
    {
        get;
        set;
    }

    public string Author { get; set; }

    public string Type { get; set; }

    public string ElementId { get; set; }

    public string Diff { get; set; }

    public long CreateDate { get; set; }
    
}

 public class AuditsService
    {
        private readonly IServiceScopeFactory _serviceScopeFactory;

        public const string TypeKey = "Audits";

        public AuditsService(IServiceScopeFactory serviceScopeFactory)
        {
            _serviceScopeFactory = serviceScopeFactory;
        }
        
        public static void ConfigureAudits(IServiceProvider serviceProvider)
        {
            var queue = serviceProvider.GetService<IQueue>();
            var auditsService = serviceProvider.GetService<AuditsService>();
            queue.Subscribe(TypeKey, auditsService.CallbackAsync);
        }

        public async Task<bool> CallbackAsync(string type, string message)
        {
            if (type != TypeKey) return false;
            var auditDataModel = JsonConvert.DeserializeObject<AuditDataModel>(message);
            await AddAuditAsync(auditDataModel);
            return true;
        }

        private async Task AddAuditAsync(AuditDataModel auditDataModel)
        {
            await Task.Run(async () =>
            {
                using var scope = _serviceScopeFactory.CreateScope();
                var serviceProvider = scope.ServiceProvider;
                var historyRepository = (AuditsRepository)serviceProvider.GetService(typeof(AuditsRepository));
                await SaveAsync(auditDataModel, historyRepository);
            });
        }

        private async Task SaveAsync(AuditDataModel auditDataModel, AuditsRepository auditsRepository)
        {
            var diff = await GetDiff(
                auditsRepository, auditDataModel.Type, auditDataModel.Id, auditDataModel.Data);
            if(diff != null)
            {
                var audit = new Audit
                {
                    Author = auditDataModel.Author,
                    Type = auditDataModel.Type,
                    ElementId = auditDataModel.Id,
                    Diff = diff
                };
                await auditsRepository.SaveAsync(audit);
            }
        }

        public async Task<string> GetDiff(
            AuditsRepository auditsRepository, string type, string id, string data)
        {
            var audits = await auditsRepository.FindByElementIdAsync(id, type);
            var jdp = new JsonDiffPatch();
            var patch = @"{}";
            foreach (var history in audits)
            {
                patch = jdp.Patch(patch, history.Diff);
            }
            var output = jdp.Diff(patch, data);
            return output;
        }

    }
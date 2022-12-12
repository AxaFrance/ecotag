using System;
using System.Collections.Generic;
using System.Text.Json;
using System.Threading.Tasks;
using AxaGuilDEv.Ecotag.Server.Audits;
using AxaGuilDEv.Ecotag.Server.Audits.Database;
using AxaGuilDEv.Ecotag.Server.Groups.Cmd;
using AxaGuilDEv.Ecotag.Tests.Server.Datasets;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Xunit;

namespace AxaGuilDEv.Ecotag.Tests.Server.Audit;

public class CreateAuditShould
{
    public static Func<AuditContext> GetInMemoryAuditContext()
    {
        var builder = new DbContextOptionsBuilder<AuditContext>();
        var databaseName = Guid.NewGuid().ToString();
        builder.UseInMemoryDatabase(databaseName);

        AuditContext AuditContext()
        {
            var options = builder.Options;
            var auditContext = new AuditContext(options);
            auditContext.Database.EnsureCreated();
            auditContext.Database.EnsureCreatedAsync();
            return auditContext;
        }
        return AuditContext;
    }
    
    [Fact]
    public async Task CreateAudit()
    {
        var auditContextFunc = GetInMemoryAuditContext();
        var auditContext = auditContextFunc();
        var auditsRepository = new AuditsRepository(auditContext);
        var mockedService = DatasetMock.GetMockedServiceProvider(auditContextFunc);
        mockedService.ServiceProvider.Setup(foo => foo.GetService(typeof(AuditsRepository))).Returns(auditsRepository);
        
        var queue = new Queue();
        var auditsService = new AuditsService(mockedService.ServiceScopeFactory.Object);
        queue.Subscribe(AuditsService.TypeKey, auditsService.CallbackAsync);

        var id = "10000000-0000-0000-0000-000000000000";
        var updateGroupInput = new UpdateGroupInput()
        {
            Id = id,
            UserIds = new List<string>() { "user1", "user2" }
        };

        var typeGroupes = "Teams";
        var message1 = new AuditDataModel()
        {
            Author = "s66666",
            Id = id,
            Type = typeGroupes,
            Data = JsonSerializer.Serialize(updateGroupInput)
        };
        await queue.PublishAsync(AuditsService.TypeKey, message1);
        
        updateGroupInput.UserIds.Add("user3");
        var message2 = new AuditDataModel()
        {
            Author = "s66667",
            Id = id,
            Type = typeGroupes,
            Data = JsonSerializer.Serialize(updateGroupInput)
        };
        await queue.PublishAsync(AuditsService.TypeKey, message2);

        var auditsController = new AuditsController();
        var responseAudits = await auditsController.GetAllAudits(auditsRepository, id, typeGroupes);

        var resultOk = responseAudits.Result as OkObjectResult;
        Assert.NotNull(resultOk);
        var resultValue = resultOk.Value as IList<AxaGuilDEv.Ecotag.Server.Audits.Audit>;
        Assert.NotNull(resultValue);
        Assert.Equal(2, resultValue.Count);
        
        var responseAuditedData = await auditsController.GetAuditedData(auditsRepository, auditsService, id, typeGroupes, 1);
        
        var auditedDataResultOk = responseAuditedData.Result as OkObjectResult;
        Assert.NotNull(auditedDataResultOk);
        var auditedDataResultValue = auditedDataResultOk.Value as string;
        Assert.NotNull(auditedDataResultValue);


    }

}
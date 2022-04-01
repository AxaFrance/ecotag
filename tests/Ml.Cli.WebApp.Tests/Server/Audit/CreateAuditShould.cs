using System;
using System.Collections.Generic;
using System.Text.Json;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using Ml.Cli.WebApp.Server;
using Ml.Cli.WebApp.Server.Audits;
using Ml.Cli.WebApp.Server.Audits.Database;
using Ml.Cli.WebApp.Server.Datasets;
using Ml.Cli.WebApp.Server.Datasets.Cmd;
using Ml.Cli.WebApp.Server.Datasets.Database;
using Ml.Cli.WebApp.Server.Groups.Cmd;
using Moq;
using Xunit;

namespace Ml.Cli.WebApp.Tests.Server.Datasets;

public class CreateAuditShould
{
    public static AuditContext GetInMemoryAuditContext()
    {
        var builder = new DbContextOptionsBuilder<AuditContext>();
        var databaseName = Guid.NewGuid().ToString();
        builder.UseInMemoryDatabase(databaseName);

        var options = builder.Options;
        var auditContext = new AuditContext(options);
        auditContext.Database.EnsureCreated();
        auditContext.Database.EnsureCreatedAsync();
        return auditContext;
    }
    
    [Fact]
    public async Task CreateAudit()
    {
        var auditContext = GetInMemoryAuditContext();
        var auditsRepository = new AuditsRepository(auditContext);
        var serviceProvider = DatasetMock.GetMockedServiceProvider(auditContext);
        serviceProvider.Setup(foo => foo.GetService(typeof(AuditsRepository))).Returns(auditsRepository);
        
        var serviceScope = new Mock<IServiceScope>();
        serviceScope.Setup(x => x.ServiceProvider).Returns(serviceProvider.Object);
        var serviceScopeFactory = new Mock<IServiceScopeFactory>();
        serviceScopeFactory
            .Setup(x => x.CreateScope())
            .Returns(serviceScope.Object);

        serviceProvider
            .Setup(x => x.GetService(typeof(IServiceScopeFactory)))
            .Returns(serviceScopeFactory.Object);

        var queue = new Queue();
        var auditsService = new AuditsService(serviceScopeFactory.Object);
        queue.Subscribe(AuditsService.TypeKey, auditsService.CallbackAsync);

        var id = "10000000-0000-0000-0000-000000000000";
        var updateGroupInput = new UpdateGroupInput()
        {
            Id = id,
            UserIds = new List<string>() { "user1", "user2" }
        };

        var typeGroupes = "Groupes";

        var message1 = JsonSerializer.Serialize(new AuditDataModel()
        {
            Author = "s66666",
            Id = id,
            Type = typeGroupes,
            Data = JsonSerializer.Serialize(updateGroupInput)
        });
        await queue.PublishAsync(AuditsService.TypeKey, message1);
        
        updateGroupInput.UserIds.Add("user3");
        var message2 = JsonSerializer.Serialize(new AuditDataModel()
        {
            Author = "s66667",
            Id = id,
            Type = typeGroupes,
            Data = JsonSerializer.Serialize(updateGroupInput)
        });
        await queue.PublishAsync(AuditsService.TypeKey, message2);

        var audits = await auditsRepository.FindByElementIdAsync(id, typeGroupes);
        
        Assert.Equal(2, audits.Count);
    }

}
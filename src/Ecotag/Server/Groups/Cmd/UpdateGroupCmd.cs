using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Text.Json;
using System.Text.Json.Serialization;
using System.Threading.Tasks;
using AxaGuilDEv.Ecotag.Server.Audits;
using AxaGuilDEv.Ecotag.Server.Groups.Database.Group;

namespace AxaGuilDEv.Ecotag.Server.Groups.Cmd;

public record UpdateGroupInput
{
    [Required] public string Id { get; set; }

    public List<string> UserIds { get; set; }
}

public class UpdateGroupCmd
{
    public const string InvalidModel = "InvalidModel";
    public const string UserDuplicate = "UserDuplicate";
    private readonly GroupsRepository _groupsRepository;
    private readonly IQueue _queue;

    public UpdateGroupCmd(GroupsRepository groupsRepository, IQueue queue)
    {
        _groupsRepository = groupsRepository;
        _queue = queue;
    }

    public async Task<ResultWithError<string, ErrorResult>> ExecuteAsync(UpdateGroupInput updateGroupInput,
        string nameIdentifier)
    {
        var commandResult = new ResultWithError<string, ErrorResult>();

        var validationResult = new Validation().Validate(updateGroupInput);
        if (!validationResult.IsSuccess)
        {
            commandResult.Error = new ErrorResult
            {
                Key = InvalidModel,
                Error = validationResult.Errors
            };
            return commandResult;
        }

        var duplicateFinder = new HashSet<string>();
        foreach (var userId in updateGroupInput.UserIds)
        {
            var isDuplicate = !duplicateFinder.Add(userId);
            if (isDuplicate)
            {
                commandResult.Error = new ErrorResult
                {
                    Key = UserDuplicate
                };
                return commandResult;
            }
        }

        var updateDate = DateTime.Now.Ticks;
        commandResult =
            await _groupsRepository.UpdateGroupUsers(updateGroupInput.Id, updateGroupInput.UserIds, updateDate);

        await _queue.PublishAsync(AuditsService.TypeKey, new AuditDataModel
        {
            Author = nameIdentifier,
            Id = commandResult.Data,
            Type = "Teams",
            Data = JsonSerializer.Serialize(new GroupUpdateAudit
            {
                Id = updateGroupInput.Id,
                UpdateDate = updateDate,
                UserIds = updateGroupInput.UserIds
            }, GroupUpdateAuditSerializerContext.Default.GroupUpdateAudit)
        });

        return commandResult;
    }
}

public record GroupUpdateAudit
{
    public string Id { get; set; }
    public List<string> UserIds { get; set; }
    public long UpdateDate { get; set; }
}

[JsonSerializable(typeof(GroupUpdateAudit))]
[JsonSourceGenerationOptions(WriteIndented = false, DefaultIgnoreCondition = JsonIgnoreCondition.WhenWritingNull)]
public partial class GroupUpdateAuditSerializerContext : JsonSerializerContext;
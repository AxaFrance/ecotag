using System.ComponentModel.DataAnnotations;
using System.Threading.Tasks;
using AxaGuilDEv.Ecotag.Server.Groups.Database.Users;
using AxaGuilDEv.Ecotag.Server.Groups.Oidc;

namespace AxaGuilDEv.Ecotag.Server.Groups.Cmd;

public record CreateUserInput
{
    [Required] [MaxLength(64)] public string NameIdentifier { get; set; }

    [Required] public string AccessToken { get; set; }
}

public class CreateUserCmd
{
    public const string InvalidModel = "InvalidModel";
    private readonly IOidcUserInfoService _userInfoService;
    private readonly UsersRepository _userRepository;

    public CreateUserCmd(UsersRepository userRepository, IOidcUserInfoService userInfoService)
    {
        _userRepository = userRepository;
        _userInfoService = userInfoService;
    }

    public async Task<ResultWithError<string, ErrorResult>> ExecuteAsync(CreateUserInput createUserInput)
    {
        var commandResult = new ResultWithError<string, ErrorResult>();

        var validationResult = new Validation().Validate(createUserInput);
        if (!validationResult.IsSuccess)
        {
            commandResult.Error = new ErrorResult
            {
                Key = InvalidModel,
                Error = validationResult.Errors
            };
            return commandResult;
        }

        var nameIdentifier = createUserInput.NameIdentifier;
        var accessToken = createUserInput.AccessToken;
        var userDataModel = await _userRepository.GetUserByNameIdentifierAsync(nameIdentifier);
        if (userDataModel != null) return commandResult;
        OidcUserInfo userEMail;
        if (nameIdentifier == "computer")
        {
            userEMail = new OidcUserInfo("computer@ecotag.com");
        }
        else
        {
            userEMail = await _userInfoService.GetUserEmailAsync(accessToken);
        }
        var result = await _userRepository.CreateUserAsync(userEMail.Email, nameIdentifier);
        if (!result.IsSuccess)
        {
            commandResult.Error = result.Error;
            return commandResult;
        }

        commandResult.Data = result.Data;

        return commandResult;
    }
}
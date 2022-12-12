namespace AxaGuilDEv.Ecotag.Server;

public interface IResult
{
    bool IsSuccess { get; }
}

public class Result : IResult
{
    public Result()
    {
        ValidationResult = new ValidationResult();
    }

    public ValidationResult ValidationResult { get; }

    public bool IsSuccess => ValidationResult.IsSuccess;
}

public sealed class Result<T> : Result
{
    public T Data { get; set; }
}

public sealed class ResultWithError<T, TE> : IResult where TE : ErrorResult, new()
{
    public T Data { get; set; }

    public TE Error { get; set; }

    public bool IsSuccess => Error == null;

    public ResultWithError<T, TE> ReturnError(string key, object error = null)
    {
        Error = new TE
        {
            Key = key,
            Error = error
        };
        return this;
    }
}
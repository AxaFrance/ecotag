using System.Collections.Generic;

namespace AxaGuilDEv.Ecotag.Server;

public class ValidationResult
{
    public ValidationResult()
    {
        Errors = new Dictionary<string, Error>();
    }

    public IDictionary<string, Error> Errors { get; }

    public bool IsSuccess => Errors.Count <= 0;

    public void AddError(string code, string message = null, IDictionary<string, string> errorDetails = null)
    {
        Errors.Add(code, new Error { Message = message, ErrorDetails = errorDetails });
    }

    public bool ContainsKey(string key)
    {
        return Errors.ContainsKey(key);
    }
}

/// <summary>
///     Représente une erreur
/// </summary>
public class Error
{
    public string Message { get; set; }
    public object ErrorDetails { get; set; }
}
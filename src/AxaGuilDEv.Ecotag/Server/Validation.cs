using System.Collections;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Reflection;

namespace Ml.Cli.WebApp.Server;

public class ValidateResult
{
    public bool IsSuccess { get; set; }
    public IDictionary<string, object> Errors { get; } = new Dictionary<string, object>();
}

public class Validation
{
    public ValidateResult Validate(object model, bool isRecursive = false)
    {
        var result = new ValidateResult();
        if (model == null) return result;

        var context = new ValidationContext(model, null, null);
        var list = new List<System.ComponentModel.DataAnnotations.ValidationResult>();
        var isValid = Validator.TryValidateObject(model, context, list, true);
        if (!isValid)
        {
            foreach (var error in list)
                if (!result.Errors.ContainsKey(error.MemberNames.FirstOrDefault()))
                    result.Errors.Add(error.MemberNames.FirstOrDefault(), error.ErrorMessage);
            return result;
        }

        result.IsSuccess = true;

        if (isRecursive) return ValidateRecursive(model);

        return result;
    }

    private ValidateResult ValidateRecursive(object model)
    {
        var result = new ValidateResult();
        if (model == null) return result;

        var propertyInfos =
            model.GetType()
                .GetProperties(BindingFlags.SetField | BindingFlags.Instance | BindingFlags.GetField |
                               BindingFlags.CreateInstance | BindingFlags.Public);

        foreach (var propertyInfo in propertyInfos)
        {
            // Si one to one
            var value = propertyInfo.GetValue(model);

            if (IsComplexObject(value))
            {
                var list = value as IEnumerable;
                if (list != null)
                {
                    foreach (var item in list)
                        if (IsComplexObject(item))
                        {
                            var isValid = Validate(item, true);
                            if (!isValid.IsSuccess) return isValid;
                        }
                }
                else
                {
                    var isValid = Validate(value, true);
                    if (!isValid.IsSuccess) return isValid;
                }
            }
        }

        result.IsSuccess = true;
        return result;
    }

    private static bool IsComplexObject(object value)
    {
        return value != null && !value.GetType().IsValueType && !(value is string);
    }
}
﻿using System.Linq;

namespace Ml.Cli.WebApp.Server.Groups.Database.Users;

public static class Converter
{
    public static UserDataModel ToUserDataModel(this UserModel userModel)
    {
        return new UserDataModel
        {
            Id = userModel.Id.ToString(),
            Email = userModel.Email,
            Subject = userModel.Subject,
        };
    }
    
    public static UserDataModelWithGroups ToUserDataModelWithGroups(this UserModel userModel)
    {
        return new UserDataModelWithGroups
        {
            Id = userModel.Id.ToString(),
            Email = userModel.Email,
            Subject = userModel.Subject,
            GroupIds = userModel.GroupUsers.Select(groupUsers => groupUsers.GroupId.ToString()).ToList()
        };
    }
    
    public static UserDataModel ToListUserDataModel(this UserModel userModel)
    {
        return new UserDataModel
        {
            Id = userModel.Id.ToString(),
            Email = userModel.Email,
            Subject = userModel.Subject
        };
    }
}
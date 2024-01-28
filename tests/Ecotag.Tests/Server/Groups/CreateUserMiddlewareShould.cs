﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;
using AxaGuilDEv.Ecotag.Server.Groups;
using AxaGuilDEv.Ecotag.Server.Groups.Cmd;
using AxaGuilDEv.Ecotag.Server.Groups.Database;
using AxaGuilDEv.Ecotag.Server.Groups.Database.Users;
using AxaGuilDEv.Ecotag.Server.Groups.Oidc;
using AxaGuilDEv.Ecotag.Server.Oidc;
using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Caching.Memory;
using Microsoft.Extensions.Options;
using Moq;
using Newtonsoft.Json;
using Xunit;

namespace AxaGuilDEv.Ecotag.Tests.Server.Groups;

public class CreateUserMiddlewareShould
    {
        
        private static GroupContext GetInMemoryGroupContext()
        {
            var builder = new DbContextOptionsBuilder<GroupContext>();
            var databaseName = Guid.NewGuid().ToString();
            builder.UseInMemoryDatabase(databaseName);

            var options = builder.Options;
            var groupContext = new GroupContext(options);
            groupContext.Database.EnsureCreated();
            groupContext.Database.EnsureCreatedAsync();
            return groupContext;
        }

        private static DefaultHttpContext DefaultHttpContext(string path, string subject, string authorization= "Bearer access_token")
        {
            var context = new DefaultHttpContext()
            {
                User = new ClaimsPrincipal(new ClaimsIdentity(new[]
                {
                    new Claim(IdentityExtensions.EcotagClaimTypes.NameIdentifier, subject),
                }
                ))
            };
            context.Request.Path = path;
            context.Request.Headers[CreateUserMiddleware.Authorization] = authorization;
             return context;
        }
        
        [Theory]
        [InlineData("/api/toto", "S66666", "[]", 1, 200, "Bearer access_token")]
        [InlineData("/api/toto", "S123456789abcdefghijklidzadkzodkazjidoS123456789abcdefghijklidzadkzodkazjidoS123456789abcdefghijklidzadkzodkazjidoS123456789abcdefghijklidzadkzodkazjido", "[]", 0, 200, "Bearer access_token")]
        [InlineData("/api/toto","s66666", "[{\"Email\":\"guillaume.chervet@toto.fr\",\"NameIdentifier\":\"s66666\"}]", 1, 200, "Bearer access_token")]
        [InlineData("/api/toto","", "[{\"Email\":\"computer@ecotag.com\",\"NameIdentifier\":\"computer\"}]", 1, 200, "Bearer access_token")]
        [InlineData("/notapi","s66666", "[]", 0, 200, "Bearer access_token")]
        [InlineData("/api/toto","s66666", "[]", 0, 401, "")]
        public async Task CreateUser(string path, string subject, string usersInDatabase, int expectedNumberUsersInDatabase, int expectedStatusCode, string authorization)
        {
            var groupContext = GetInMemoryGroupContext();
            
            var usersList = JsonConvert.DeserializeObject<List<UserDataModelWithGroups>>(usersInDatabase);
            foreach (var userDataModel in usersList)
            {
                groupContext.Users.Add(new UserModel()
                    { Email = userDataModel.Email, NameIdentifier = userDataModel.NameIdentifier });
            }
            await groupContext.SaveChangesAsync();
            RequestDelegate nextMiddleware = (HttpContext) =>
            {
                return Task.FromResult("");
            };
            var createUserMidleware = new CreateUserMiddleware(nextMiddleware);
            var httpContext = DefaultHttpContext(path, subject, authorization);
            var oidcUserInfoServiceMock = new Mock<IOidcUserInfoService>();
            var oidcUserInfo = new OidcUserInfo("guillaume.chervet@toto.fr");
            oidcUserInfoServiceMock.Setup(it => it.GetUserEmailAsync(It.IsAny<string>())).ReturnsAsync(oidcUserInfo);
            
            var memoryCache = new MemoryCache(Options.Create(new MemoryCacheOptions()));
            await createUserMidleware.InvokeAsync(httpContext,
                new CreateUserCmd(new UsersRepository(groupContext,memoryCache), oidcUserInfoServiceMock.Object));
            
            Assert.Equal(expectedStatusCode, httpContext.Response.StatusCode);
            Assert.Equal(expectedNumberUsersInDatabase, groupContext.Users.Count());
        }
        
    }

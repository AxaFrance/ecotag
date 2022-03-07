using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;
using Ml.Cli.WebApp.Server.Database.Users;
using Ml.Cli.WebApp.Server.Groups;
using Ml.Cli.WebApp.Server.Groups.Cmd;
using Ml.Cli.WebApp.Server.Groups.Database;
using Ml.Cli.WebApp.Server.Groups.Database.Users;
using Ml.Cli.WebApp.Server.Groups.Oidc;
using Ml.Cli.WebApp.Server.Oidc;
using Moq;
using Newtonsoft.Json;

namespace Ml.Cli.WebApp.Tests.Server.Groups;

using Xunit;

public class CreateUserMiddlewareSould
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

        private static DefaultHttpContext DefaultHttpContext(string path, string subject)
        {
            var context = new DefaultHttpContext()
            {
                User = new ClaimsPrincipal(new ClaimsIdentity(new Claim[]
                {
                    new Claim(IdentityExtensions.EcotagClaimTypes.Sub, subject),
                }
                ))
                
            };
            context.Request.Path = path;
            context.Request.Headers[CreateUserMiddleware.AccessToken] = "access_token";
             return context;
        }
        
        [Theory]
        [InlineData("/api/toto", "S66666", "[]", 1, 200)]
        [InlineData("/api/toto", "S123456789abcdefghijkl", "[]", 0, 200)]
        [InlineData("/api/toto","s66666", "[{\"Email\":\"guillaume.chervet@toto.fr\",\"Subject\":\"s66666\"}]", 1, 200)]
        [InlineData("/api/toto","", "[]", 0, 403)]
        [InlineData("/notapi","s66666", "[]", 0, 200)]
        public async Task CreateUser(string path, string subject, string usersInDatabase, int expectedNumberUsersInDatabase, int expectedStatusCode)
        {
            var groupContext = GetInMemoryGroupContext();
            
            var usersList = JsonConvert.DeserializeObject<List<UserDataModel>>(usersInDatabase);
            foreach (var userDataModel in usersList)
            {
                groupContext.Users.Add(new UserModel()
                    { Email = userDataModel.Email, Subject = userDataModel.Subject });
            }
            await groupContext.SaveChangesAsync();
            RequestDelegate nextMiddleware = (HttpContext) =>
            {
                return Task.FromResult("");
            };
            var createUserMidleware = new CreateUserMiddleware(nextMiddleware);
            var httpContext = DefaultHttpContext(path, subject);
            var oidcUserInfoServiceMock = new Mock<IOidcUserInfoService>();
            var oidcUserInfo = new OidcUserInfo() { Email = "guillaume.chervet@toto.fr" };
            oidcUserInfoServiceMock.Setup(it => it.GetUserEmailAsync(It.IsAny<string>())).ReturnsAsync(oidcUserInfo);

            createUserMidleware.InvokeAsync(httpContext,
                new CreateUserCmd(new UsersRepository(groupContext), oidcUserInfoServiceMock.Object));
            
            Assert.Equal(expectedStatusCode, httpContext.Response.StatusCode);
            Assert.Equal(groupContext.Users.Count(), expectedNumberUsersInDatabase);
        }
        
    }

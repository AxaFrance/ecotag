FROM mcr.microsoft.com/dotnet/sdk:6.0 AS build

RUN curl -sL https://deb.nodesource.com/setup_14.x | bash - \
 && apt-get install -y --no-install-recommends nodejs \
 && echo "node version: $(node --version)" \
 && echo "npm version: $(npm --version)" \
 && rm -rf /var/lib/apt/lists/*

WORKDIR /src
RUN echo "dotnet Version:" &&  dotnet --version
COPY . .
RUN dotnet publish "./src/Ml.Cli.WebApp/Ml.Cli.WebApp.csproj" -c Release -r linux-x64 --self-contained=true /p:PublishSingleFile=true /p:PublishTrimmed=true /p:PublishReadyToRun=true -o /publish

FROM mcr.microsoft.com/dotnet/runtime-deps:6.0 AS final
WORKDIR /app
COPY --from=build /publish .
ENTRYPOINT ["/app/Ml.Cli.WebApp", "--base-path", "../"]

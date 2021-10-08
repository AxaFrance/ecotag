FROM node:lts-buster-slim AS node_base
FROM mcr.microsoft.com/dotnet/core/sdk:3.1 AS build
COPY --from=node_base . .
WORKDIR /src
RUN echo "NODE Version:" && node --version
RUN echo "NPM Version:" && npm --version
RUN echo "dotnet Version:" &&  dotnet --version
COPY . .
WORKDIR /src/src/Ml.Cli.WebApp
ENTRYPOINT ["dotnet", "run", "--", "--tasks-path", "../../demo/tasks-licenses-docker-compose.json", "--base-path", "../../demo", "--compares-paths", "licenses/compares", "--datasets-paths", "licenses/datasets"]
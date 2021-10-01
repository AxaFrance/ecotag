FROM node:lts-buster-slim AS node_base
FROM mcr.microsoft.com/dotnet/core/sdk:3.1 AS build
COPY --from=node_base . .
WORKDIR /src
RUN echo "NODE Version:" && node --version
RUN echo "NPM Version:" && npm --version
RUN echo "dotnet Version:" &&  dotnet --version
COPY . .
WORKDIR /src/src/Ml.Cli.WebApp
RUN dotnet run -- --urls=http://localhost:5000/ --tasks-path ../../demo/tasks-licenses-mac-linux.json --base-path ../../demo --compares-paths licenses/output --datasets-paths licenses/datasets

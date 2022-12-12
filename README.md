# Ecotag

[![CI](https://github.com/AxaGuilDEv//ecotag/actions/workflows//ecotag-ci.yml/badge.svg)](https://github.com/AxaGuilDEv//ecotag/actions/workflows//ecotag-ci.yml)
[![Quality Gate](https://sonarcloud.io/api/project_badges/measure?project=AxaGuilDEv_/ecotag&metric=alert_status)](https://sonarcloud.io/dashboard?id=AxaGuilDEv_/ecotag) [![Reliability](https://sonarcloud.io/api/project_badges/measure?project=AxaGuilDEv_/ecotag&metric=reliability_rating)](https://sonarcloud.io/component_measures?id=AxaGuilDEv_/ecotag&metric=reliability_rating) [![Security](https://sonarcloud.io/api/project_badges/measure?project=AxaGuilDEv_/ecotag&metric=security_rating)](https://sonarcloud.io/component_measures?id=AxaGuilDEv_/ecotag&metric=security_rating) [![Code Corevage](https://sonarcloud.io/api/project_badges/measure?project=AxaGuilDEv_/ecotag&metric=coverage)](https://sonarcloud.io/component_measures?id=AxaGuilDEv_/ecotag&metric=Coverage) [![Twitter](https://img.shields.io/twitter/follow/GuildDEvOpen?style=social)](https://twitter.com/intent/follow?screen_name=GuildDEvOpen) [![Docker Ecotag](https://img.shields.io/docker/pulls/axaguildev/ecotag.svg)](https://hub.docker.com/r/axaguildev/ecotag/builds)

- [About](#about)
- [Getting Started](#getting-started)
- [How It Works](#how-it-works)
- [Contribute](#contribute)

![ecotag webapp](./docs/ecotag.PNG "ecotag webapp")


# About

Ecotag an is an awesome annotation tools.
- Manage OIDC authentication
- Manage teams 
- Manage roles (ECOTAG_ADMINISTRATEUR, ECOTAG_DATA_SCIENTIST, ECOTAG_ANNOTATEUR)
- Manage datasets
- Create labelling project
  - Image : png, jpg, jpeg 
    - Zoning
    - Classification
    - Rotation
    - Transcription
  - Document : txt, .eml, .msg, .jpg, .png, jpeg, .tiff, .tif, .pdf, .doc, .docx, .xls, .xlsx, .ppt, .pptx, .rtf, .odt, .ods, .odp, .zip
    - Classification 
    - Transcription
  - Text NER Zoning
- Labelling Export

ML-Cli is the official CLI of Ecotag [/ecotag Readme](https://github.com/AxaGuilDEv/ecotag/blob/master/README-/ecotag.md)


Video of features:
- French : https://www.youtube.com/watch?v=jB8AQAtxk_E

A storybook is available here https://happy-desert-0ef175103.1.azurestaticapps.net/

# Getting started

To run the demo with .NET 6 on your machine :

```sh
git clone https://github.com/AxaGuilDEv/ecotag.git

# Run blob storage and SQL Server
cd ./ecotag
docker-compose up 
# then, you can navigate to http://localhost:5010
```

# How it works

Technologies:
- react
- .NET 6
- OpenID Connect 

![/ecotag webapp](./docs/ecotag_architecture.PNG "ecotag webapp")

# Contribute

- [How to run the solution and to contribute](./CONTRIBUTING.md)
- [Please respect our code of conduct](./CODE_OF_CONDUCT.md)
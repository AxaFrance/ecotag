# Ml-Cli installation and usage in JupyterLab

## Introduction

Installing Ml-Cli on Jupyterlab can be done in two ways. Both of them will require an url to download a ml-cli artifact.

## Artifacts

The artifacts can be found [here](https://dev.azure.com/axaguildev/ml-cli/_build?definitionId=11).
Please copy the url of an Ubuntu artifact.

## Manual version

Open a console in your JupyterLab environment, and use the following commands:
- mkdir ml-cli
- cd ml-cli
- curl <ARTIFACT URL> --output ml-cli.zip
- unzip ml-cli.zip
- unzip ubuntu/ml-cli-webapp/Ml.Cli.WebApp.zip
- echo '[]' > tasks.json

To launch Ml-Cli, use the following command in the ml-cli folder:
./Ml.Cli.WebApp -s ./ -t tasks.json -b ./ -c ./ -d ./
Please refer to the [Readme](./README.md) to change the parameters as you wish and update the tasks.json file.

## Automatic version

Create a folder in your JupyterLab environment, which will contain the [ml-cli-jupyter.sh](./Jupyterlab/ml-cli-jupyter.sh) file and the [ml-cli-launcher](./Jupyterlab/ml-cli-launcher.sh) file.

Open a console to launch the first file with the following command: "./ml-cli-jupyter.sh <ARTIFACT URL>".

You can now use the second file to launch Ml-Cli in your JupyterLab environment, and use the automatically created tasks.json file to define your tasks. Please note that the launcher provides default parameters to Ml-Cli and might need to be updated by the user accordingly to its usage.

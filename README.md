# Introduction 

[![Build Status](https://dev.azure.com/axaguildev/ml-cli/_apis/build/status/AxaGuilDEv.ml-cli?branch=master)](https://dev.azure.com/axaguildev/ml-cli/_build/latest?definitionId=6&branchName=master)
[![Quality Gate](https://sonarcloud.io/api/project_badges/measure?project=AxaGuilDEv_ml-cli&metric=alert_status)](https://sonarcloud.io/dashboard?id=AxaGuilDEv_ml-cli) [![Reliability](https://sonarcloud.io/api/project_badges/measure?project=AxaGuilDEv_ml-cli&metric=reliability_rating)](https://sonarcloud.io/component_measures?id=AxaGuilDEv_ml-cli&metric=reliability_rating) [![Security](https://sonarcloud.io/api/project_badges/measure?project=AxaGuilDEv_ml-cli&metric=security_rating)](https://sonarcloud.io/component_measures?id=AxaGuilDEv_ml-cli&metric=security_rating) [![Code Corevage](https://sonarcloud.io/api/project_badges/measure?project=AxaGuilDEv_ml-cli&metric=coverage)](https://sonarcloud.io/component_measures?id=AxaGuilDEv_ml-cli&metric=Coverage) [![Twitter](https://img.shields.io/twitter/follow/GuildDEvOpen?style=social)](https://twitter.com/intent/follow?screen_name=GuildDEvOpen)

Ml-Cli is a command line batch and a local web interface&api that automates :
- API integration tests (with Authentication)
- Compare datasets (images, json), for:
    - Debugging
    - Annotations corrections
- Aspirate datasets (images, json), for:
    - Pre-annotation
    - Comparison
- Reformat datasets 
- Calculations
    - Error rate character
    - Zoning error rate
    - Completeness rate
- Document annotations

We use ml-cli mainly in the ML Flow production phase. We use it to test and **visually** debug  complexe pipeline.

## ML workflow: Experimentation phase 

![Experimentation phase](./docs/experimentation-phase.PNG "Experimentation phase")

## ML workflow: Production phase
 
![Production phase](./docs/production-phase.PNG "Production phase")

## Production workflow (sample)

In production we use complexe sequence of algorithm ML in a micro-service architecture. 

![Production workflow](./docs/workflow-license.PNG "Workflow license production")

# Getting started

To run the demo :

```sh
git clone https://github.com/AxaGuilDEv/ml-cli
cd ml-cli/src/Ml.Cli.DemoApi
dotnet run
# run demo API, you can navigate at https://localhost:6001/licenses/version

cd ml-cli/src/Ml.Cli.WebApp
dotnet run -- ..\..\demo ..\..\demo\tasks-licenses.json  ..\..\demo
# run ml-cli batch + web application
# you can navigate at https://localhost:5001

```

Run the application on Windows:
```sh
Ml.Cli.exe "path to webapp base directory" "path to tasks.json" "path to webserver base directory"
```

Run on Mac:
```sh
Ml.Cli "path to webapp base directory" "path to tasks.json" "path to webserver base directory"
```


 - **The webapp base directory** is a path (that mandatorily ends with a directory separator) that defines a directory that the webapp controllers can access to get images and read/write in files. Those operations cannot be done outside of this directory. This is a security to prevent third party data recovery from your local storage. Trying to access data located outside this directory will result in a bad request error. Please note that you cannot give paths that contain "..\\" to the webapp. It will also result in a bad request error if you do so.
 - **The path** of the tasks.json file
 - **The path of your webserver** base directory (so you don't have to put full paths in the "fileDirectory/imageDirectory/etc." attributes of your tasks - but you can do it if you want to)

# How it works

## Production architecture

We use microservice architecture when needed and mainly use "functions". Each algorithm can be hosted by a function. We mainly use redis to share data bewteen functions.

![Production architecture](./docs/function-architecture.PNG "Production architecture")

We have normalized mandatory HTTP functions routes:
- **/**
- **/upload** : build for debugging and ml-cli
- **/upload-integration** : build for debugging and ml-cli
- **/version** : used by ml-cli
- **/health**
- **/metrics**

```sh
# the default route used internally by all services
/ 

input :
{
    "id": "file_id"
    "settings": {...}
}

# the route bellow add files url in the output data
/upload

input :
curl --request POST \
  --url https://localhost:6001/licenses/upload-integration \
  --header 'Content-Type: multipart/form-data' \
  --form file= 'binary data'\
  --form settings= 'binary data'

output :
{
  "analysis": [
    {
      "elements": [
        {
          "document_type": "nouveau_permis_recto",
          "confidence_rate": 99.69,
          "license_delivery_country": "France"
          "url_file_new_recto_zone": "http://localhost:6001/files/5e0d28d8-17ea-42b7-ac24-f4192e8e103c",
          "input_new_recto_zone" : {"id":"5e0d28d8-17ea-42b7-ac24-f4192e8e103c"}
          "output_new_recto_zone" : {"zones":[{"confidence": 0.95,"coordinates": {"xmax": 3749,"xmin": 289,"ymax": 2620,"ymin": 917},"label": "nouveau_permis_recto"}]}
        }]
    }]
 "version": "1.0.0"
}

# this route alway return the same output (remove version number etc.)
/upload-integration 

curl --request POST \
  --url http://localhost:6001/upload-integration \
  --header 'Content-Type: multipart/form-data' \
  --form file= 'binary data'\
  --form settings= 'binary data'

output :
{
  "analysis": [
    {
      "elements": [
        {
          "document_type": "nouveau_permis_recto",
          "confidence_rate": 99.69,
          "license_delivery_country": "France"
        }]
    }]
}

# the route version bellow add files url ine the output data
/version

output : 
{"version":"1.0.3"}

# the route health bellow is used by kubernetes to know the pod health
/health

output : 
{"status":"OK"}

# the route metrics bellow give internal pod data to prometheus
/metrics

output: 
# HELP python_gc_objects_collected_total Objects collected during gc
# TYPE python_gc_objects_collected_total counter
python_gc_objects_collected_total{generation="0"} 7585.0
python_gc_objects_collected_total{generation="1"} 806.0
python_gc_objects_collected_total{generation="2"} 0.0
etc.

```

## Ml-Cli batch

You can execute several tasks in command line interface (CLI):
- **wait_version_change** is a task that will wait for the version obtained via the url to change for a user-defined amount of time.
- **callapi** is a task which will call an online service to get jsons files describing files containing images. These json files contain a list of URLs leading to extracted images of the files containing images. The task can also download these images after generating the related json file.
- **parallel** and serial are used to describe the way of handling your tasks.
- **loop** is used to execute the task indefinitely.
- **script** will execute a user-defined script on files stored in a repository.
- **compare** is used to compare two sets of json files; the resulting json file can be used to see the results with the help of the server.
- **dataset** is used to generate a dataset file which will contain all annotations (of a same, user-specified type and configuration) made on json files with the help of Ml-Cli front.


### tasks-sample.json

``` 
[
	{
		"type": "wait_version_change",
		"id": "version_task",
		"enabled": true,
		"url": "https://localhost:6001/licenses/version",
		"timeout": 5000,
		"urlLogDirectory": "licenses\\output\\logs",
		"logFileName": "license.json"
	},
	{
		"type": "callapi",
		"enabled": true,
		"enabledSaveImages":true,
		"outputDirectoryImages": "licenses\\groundtruth\\images",
		"fileDirectory": "licenses\\documents",
		"outputDirectoryJsons": "licenses\\groundtruth\\jsons",
		"numberParallel": 1,
		"url" :"https://localhost:6001/licenses/upload"
	},
	{
		"type": "callapi",
		"enabled": true,
		"enabledSaveImages":true,
		"outputDirectoryImages": "licenses\\output\\{start-date}\\images",
		"fileDirectory": "licenses\\documents",
		"outputDirectoryJsons": "licenses\\output\\{start-date}\\jsons",
		"numberParallel": 1,
		"url" :"https://localhost:6001/licenses/upload"
	},
	{
		"type": "compare",
		"enabled": true,
		"onFileNotFound": "warning",
		"leftDirectory": "licenses\\groundtruth\\jsons",
		"rightDirectory": "licenses\\output\\{start-date}\\jsons",
		"outputDirectory": "licenses\\output",
		"fileName": "compare-licenses-{start-date}.json"
	  }
]
```

## ML-Cli local web interface and local API

Ml-cli web interface internally run the Ml-cli batch. 
It display a user interface and allow the user to annotate data via a Web API.

### Compare statistiques
![Compare statistiques](./docs/ml-cli-compare-statistiques.PNG "Document stats")

### Compare diff

![Compare diff](./docs/ml-cli-compare-diff.PNG "File diff example")

### Compare annotation

You can annotate the downloaded images (obtained with the task callapi described below) via an editor by clicking on the annotation button.

![Compare annotation](./docs/ml-cli-annotate.PNG "Annotation example")

*Example of annotation. The annotation button also display the images selected via a regex, whether via the front part of Ml-Cli or with the frontDefaultRegex attribute of the callapi task*

# Warning

The current application is available for local usage only. Security is not guaranteed otherwise.


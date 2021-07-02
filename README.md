# Introduction 

Ml-Cli is a command line and local tool that automates :
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

We use ml-cli mainly in the ML Flow production phase.

## Experimentation phase 

![Experimentation phase](./docs/experimentation-phase.PNG "Experimentation phase")

## Production phase
 
![Production phase](./docs/production-phase.PNG "Production phase")

# How it works

After installing Ml-Cli such as explained in the "Getting started" section, you will be able to generate and modify a list of json files which will contain the result produced by called services.
Such results can be analyzed through the front part of Ml-Cli.

![Compare statistiques](./docs/ml-cli-compare-statistiques.PNG "Document stats")

*Example of file overview*

![Compare diff](./docs/ml-cli-compare-diff.PNG "File diff example")

*Example of file comparison*

You can annotate the downloaded images (obtained with the task callapi described below) via an editor by clicking on the annotation button.

![Compare annotation](./docs/ml-cli-annotate.PNG "Annotation example")

*Example of annotation. The annotation button also display the images selected via a regex, whether via the front part of Ml-Cli or with the frontDefaultRegex attribute of the callapi task*

You can also execute several tasks in command line interface (CLI):
- wait_version_change is a task that will wait for the version obtained via the url to change for a user-defined amount of time.
- callapi is a task which will call an online service to get jsons files describing files containing images. These json files contain a list of URLs leading to extracted images of the files containing images. The task can also download these images after generating the related json file.
- parallel and serial are used to describe the way of handling your tasks.
- loop is used to execute the task indefinitely.
- script will execute a user-defined script on files stored in a repository.
- compare is used to compare two sets of json files; the resulting json file can be used to see the results with the help of the server.
- dataset is used to generate a dataset file which will contain all annotations made on json files with the help of Ml-Cli front.

# Getting started

To run the demo :

```sh
git clone https://github.com/AxaGuilDEv/ml-cli
cd ml-cli/src/Ml.Cli.DemoApi
dotnet run
# run demo API, you can navigate at https://localhost:6001/licenses/version

cd ml-cli/src/Ml.Cli.WebApp
dotnet run -- ..\..\demo\tasks-licenses.json  ..\..\demo
# run ml-cli batch + web application
# you can navigate at https://localhost:5001

```

# Getting continued

Download the artifact from the lastest build.

Create a JSON file which contains a task list to execute, whether in parallel or in sequential order.

When launching Ml-Cli, the tasks defined by the user (see examples below) will be executed, and the local server will be launched so you can watch the results of the tasks.

The file used in the front part of Ml-Cli must be a json which can be generated with the "compare" task.

tasks.json 
```sh
[
  {
    "type": "wait_version_change",
    "id": "version_task",
    "enabled": true,
    "url": "url_path",
    "timeout": 30000,
    "urlLogDirectory": "ri\\logFolder",
    "logFileName": "logFile.json"
  },
  {
    "type": "parallel",
    "id": "parallel_task",
    "enabled": true,
    "tasks": [
          {
            "type": "callapi",
            "id": "third_task",
            "enabled": true,
            "fileDirectory": "ri\\docs",
            "outputDirectoryJsons": "ri\\right-29-07-2020",
            "url" :"url_path"
          },
          {
            "type": "compare",
            "id": "fourth_task",
            "enabled": true,
            "onFileNotFound": "warning",
            "leftDirectory": "ri\\left-29-07-2020",
            "rightDirectory": "ri\\right-29-07-2020",
            "outputDirectory": "ri\\output",
            "fileName": "compare-29-07-2020.json"
         }
    ]
  },
  {
    "type": "serial",
    "id": "serial_task",
    "enabled": true,
    "tasks": [
         {
            "type": "script",
            "id": "sixth_task",
            "enabled": false,
            "fileDirectory": "ri\\right-29-07-2020",
            "outputDirectory": "ri\\elements_right",
            "script": "try{ console.WriteLine('Write your JS code on this attribute (not necessarily in a try-catch block).') } catch(ex){ console.WriteLine(ex.toString) }"
         },
         {
            "type": "script",
            "id": "seventh_task",
            "enabled": false,
            "fileDirectory": "ri\\left-29-07-2020",
            "outputDirectory": "ri\\elements_left",
            "script": "try{ console.WriteLine('Write your JS code on this attribute (not necessarily in a try-catch block).') } catch(ex){ console.WriteLine(ex.toString) }"
         }
    ]
  },
  {
    "type": "loop",
    "id": "loop_task",
    "enabled": true,
    "startMessage": "Starting loop procedure...",
    "endMessage": "End of loop procedure",
    "iterations": 3,
    "subTask": {
        "type": "callapi",
        "id": "ninth_task",
        "enabled": true,
        "fileDirectory": "ri\\docs",
        "outputDirectoryJsons": "ri\\right-{start-date}",
        "outputDirectoryImages": "ri\\right-{start-date}-images",
        "outputDirectoryInputs": "ri\\right-{start-date}-inputs",
        "outputDirectoryOutputs": "ri\\right-{start-date}-outputs",
        "frontDefaultRegex": "",      //used by the front part of Ml-Cli to get only the required images during annotation
        "downloadRegex": "",          //allows the user to only download the images, jsons inputs/outputs that matches the specified regex
        "enabledSaveImages": true,
        "enabledSaveInputs": true,
        "enabledSaveOutputs": true,
        "url": "url_path",
        "sortByFileType": false,
        "numberIteration": 2
    }
  },
  {
    "type": "dataset",
    "id": "tenth_task",
    "enabled": true,
    "fileDirectory": "ri\\right-{start-date}",
    "imageDirectory": "ri\\right-{start-date}-images,
    "outputDirectory": "ri\\dataset-output",
    "fileName": "dataset-{start-date}.json"
  }
] 
```


Please note that the "id" field and the "enabled" field are not mandatory. An id will be attributed to each task that doesn't have one (e.g the third task defined in tasks.json will have the id "task3"), and all tasks without "enabled" attribute will be executed by default.

 The Version task will log versions found for all wait_version_change instance in the same file located in the repository defined by the "urlLogDirectory" attribute.


 The Callapi task doesn't need "enabledSaveImages", "outputDirectoryImages", "outputDirectoryInputs", "outputDirectoryOutputs", "frontDefaultRegex", "downloadRegex" or "numberIteration" fields to work. The latter is used to execute the task several times and the other fields are required to download all the images from the urls stored in the resulting json files of the task.
 
 
 The Script task "script" field contains JS code. The only exception is if you want to write something in the console. If you want to do so, you have to use "console.WriteLine('Your text here')" as you would in C#.
 
 
 The Loop task contains a field "iterations" which is not necessary. If you don't specify it, it will run undefinitely; if you do, it will execute the subtask as much times as defined in the "iterations" field.
 
 
 All tasks at the root of tasks.json file, such as "version_task", "parallel_task", "serial_task" or "loop_task" are executed in sequential order.

# Hidden attributes

While using a tasks.json file, you can pass parameters to some attributes.
The elements in question are:
- fileDirectory
- leftDirectory
- rightDirectory
- urlLogDirectory
- fileName
- outputDirectoryJsons
- outputDirectoryImages
- outputDirectoryInputs
- outputDirectoryOutputs
- outputDirectory

Ml-Cli currently handles one parameter:
- {start-date} is a parameter that you can put in tasks.json as described above, in the task "loop-task". The date will be inserted at the parameter position.

# Warning

The current application is available for local usage only. Security is not guaranteed otherwise.

# Execution

Run the application on Windows:
```sh
Ml.Cli.exe "path to webapp base directory" "path to tasks.json" "path to webserver base directory"
```

Run on Mac:
```sh
Ml.Cli "path to webapp base directory" "path to tasks.json" "path to webserver base directory"
```

##### What is the point of these parameters ?

 - The webapp base directory is a path (that mandatorily ends with a directory separator) that defines a directory that the webapp controllers can access to get images and read/write in files. Those operations cannot be done outside of this directory. This is a security to prevent third party data recovery from your local storage. Trying to access data located outside this directory will result in a bad request error. Please note that you cannot give paths that contain "..\\" to the webapp. It will also result in a bad request error if you do so.
 - The path of the tasks.json file
 - The path of your webserver base directory (so you don't have to put full paths in the "fileDirectory/imageDirectory/etc." attributes of your tasks - but you can do it if you want to)
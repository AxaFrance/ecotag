# Callapi

Short description

# Samples

tasks.json 
```sh
[
  {
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
] 
```


# Properties

- **type**: name of the task
- **id**: string that represent the id
    - default: generate a GUID
- **enabled**: a boolean to enabled or disable
    - default: true
- **fileDirectory**: File in this directory are sent to the API
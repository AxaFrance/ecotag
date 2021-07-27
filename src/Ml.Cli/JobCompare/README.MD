# Compare

Compare is used to compare two sets of json files that are the output of a callapi or a script task.

The resulting json file can be used to see the results of the comparison with the help of the webapp. 

# Samples

tasks.json 
```sh
[
  {
    "type": "compare",
    "id": "compare_task",
    "enabled": true,
    "onFileNotFound": "warning",
    "leftDirectory": "licenses\\groundtruth\\jsons",
    "rightDirectory": "licenses\\output\\{start-date}\\jsons",
    "outputDirectory": "licenses\\output",
    "fileName": "compare-licenses-{start-date}.json"
  }
] 
```


# Properties

## Mandatory attributes
- **type**: name of the task
- **leftDirectory**: string that defines the path to the first set of json files
- **rightDirectory**: string that defines the path to the second set of json files
- **outputDirectory**: string that defines the path where the compare file will be generated
- **fileName**: string that defines the file name and its extension

## Unrequired attributes
- **id**: string that represents the id
    - default: generates a GUID
- **enabled**: a boolean to enable or disable the task
    - default: true
- **onFileNotFound**: string that defines if the "file not found" error is displayed as a simple warning or as an error
    - default: "exception"
    - values: "exception", "warning"
# JobVersion

Version awaits the change of version of a service called via an url.

When the version changes, the task ends and lets other tasks run.

# Samples

tasks.json 
```sh
[
  {
    "type": "wait_version_change",
    "id": "version_task",
    "enabled": true,
    "url": "https://localhost:6001/licenses/version",
    "timeout": 5000,
    "urlLogDirectory": "licenses\\output\\logs",
    "logFileName": "license.json"
  }
] 
```


# Properties

## Mandatory attributes
- **type**: name of the task
- **url**: string that defines the url to get the version of the service
- **urlLogDirectory**: string that defines the path to a repository where will be generated or updated the log file
- **logFileName**: string that defines the name and the extension of the log file which contains the version of the service
    
## Unrequired attributes
- **id**: string that represents the id
    - default: generates a GUID
- **enabled**: a boolean to enable or disable the task
    - default: true
- **timeout**: an int that defines a timeout after which the task will end, even if no new version has been found.
    - default: null (the task will never end unless a new version is found)
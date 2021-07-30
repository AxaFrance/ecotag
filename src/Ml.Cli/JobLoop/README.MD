# JobLoop

Loop is used to make its child task run several times or indefinitely.

# Samples

tasks.json 
```sh
[
  {
    "type": "loop",
    "id": "loop_task",
    "enabled": true,
    "startMessage": "Starting loop procedure...",
    "endMessage": "End of loop procedure",
    "iterations": 3,
    "subTask": {
      "type": "callapi",
      "id": "child_task",
      "enabled": true,
      "fileDirectory": "licenses\\documents",
      "outputDirectoryJsons": "licenses\\output",
      "url" :"https://localhost:6001/licenses/upload"
    },
  }
] 
```


# Properties

## Mandatory attributes
- **type**: name of the task
- **startMessage**: string to display a message when a loop iteration is starting
- **endMessage**: string to display a message when a loop iteration ends
- **subTask**: a task to which the loop will be applicated
    
## Unrequired attributes
- **id**: string that represents the id
    - default: generates a GUID
- **enabled**: a boolean to enable or disable the task
    - default: true
- **iterations**: an int that defines how many times the sub task will be called. If set to 0, the sub task will be called indefinitely
    - default: 0
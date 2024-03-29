# JobParallel

Parallel is used to run its child tasks asynchronously.

# Samples

tasks.json

```sh
[
  {
    "type": "parallel",
    "id": "parallel_task",
    "enabled": true,
    "tasks": [
        {
          "type": "callapi",
          "id": "first_child_task",
          "enabled": true,
          "fileDirectory": "licenses\\documents",
          "outputDirectoryJsons": "licenses\\groundtruth\\jsons",
          "url" :"https://localhost:6001/licenses/upload"
        },
        {
          "type": "callapi",
          "id": "second_child_task",
          "enabled": true,
          "fileDirectory": "licenses\\documents",
          "outputDirectoryJsons": "licenses\\output",
          "url" :"https://localhost:6001/licenses/upload"
        }
    ]
  },
] 
```

# Properties

## Mandatory attributes

- **type**: name of the task
- **tasks**: an array of sub tasks that will be run asynchronously

## Unrequired attributes

- **id**: string that represents the id
    - default: generates a GUID
- **enabled**: a boolean to enable or disable the task
    - default: true
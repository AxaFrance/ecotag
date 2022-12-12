# Copy

Copy data from a directory to another directory

# Samples

tasks.json

```sh
[
  {
    "type": "copy",
    "id": "copy_task",
    "enabled": true,
    "from": "licenses\\input",
    "pattern": "*.json",
    "to": "licenses\\output",
  }
] 
```

# Properties

## Mandatory attributes

- **type**: name of the task
- **from**: from directory
- **pattern**: * or *.json
- **to**: to directory

## Unrequired attributes

- **id**: string that represents the id
    - default: generates a GUID
- **enabled**: a boolean to enable or disable the task
    - default: true

# JobScript

Script is used to apply a user-defined javascript script to callapi output json files.

It behaves the same way as a script applied directly on the webapp, and is used to automate the process. Please read the [`global readme`](../../../#readme) to learn how to create a script.

# Samples

tasks.json 
```sh
[
  {
    "type": "script",
    "id": "script_task",
    "enabled": true,
    "fileDirectory": "licenses\\output",
    "outputDirectory": "licenses\\scripts",
    "script": "try{ console.WriteLine('Write your JS code on this attribute (not necessarily in a try-catch block).') } catch(ex){ console.WriteLine(ex.toString) }"
  },
] 
```


# Properties

## Mandatory attributes
- **type**: name of the task
- **fileDirectory**: string that defines the path of the directory which contain the callapi output json files to which the script will be applied
- **outputDirectory**: string that defines the path of the directory where will be generated the json files to which the script has been applied
- **script**: string that defines the script that will be applied to the "body" attribute of the callapi output jsons files
    
## Unrequired attributes
- **id**: string that represents the id
    - default: generates a GUID
- **enabled**: a boolean to enable or disable the task
    - default: true
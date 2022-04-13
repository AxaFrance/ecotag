# Callapi

Callapi calls a service via a user-defined url.

It sends the service a list of files and receives json files in response. If the json files contain urls that points to images or other json files, these images and json files can also be recovered.

# Settings

You can provide parameters when sending your files.
To do this, please consider the following example :

If you have a file named "fileName.pdf" and you want to send parameters with it, you can define a "fileName.json" file in the same repository, with the following structure:
```
{
	"type": "Multipart Form",
	"data": [
		{"key":"file", "value":"fileName.pdf", "type":"file"},
		{"key":"someParameter", "value": "parameterValue", "type":"text"},
	]
}
```
In the data parameter, you can provide as much parameters as you want. If they are of type "file", the CallApi task will search for the file in the "fileDirectory" repository and send it too.

If this configuration file is not found, the file will be sent "as is" to the URL of the CallApi task.

# Samples

tasks.json 
```sh
[
  {
    "type": "callapi",
    "id": "callapi_task",
    "enabled": true,
    "fileDirectory": "ri\\docs",
    "outputDirectoryJsons": "ri\\right-{start-date}",
    "outputDirectoryImages": "ri\\right-{start-date}-images",
    "outputDirectoryInputs": "ri\\right-{start-date}-inputs",
    "outputDirectoryOutputs": "ri\\right-{start-date}-outputs",
    "frontDefaultStringsMatcher": "",
    "downloadStringsMatcher": "rotation, firstname",
    "enabledSaveImages": true,
    "enabledSaveInputs": true,
    "enabledSaveOutputs": true,
    "url": "url_path",
    "sortByFileType": false,
    "numberIteration": 2,
    "numberParallel": 2
  }
] 
```


# Properties

## Mandatory attributes
- **type**: name of the task
- **fileDirectory**: string that defines the path of the directory which contains the elements that will be sent to the service
- **outputDirectoryJsons**: string that defines the path of the directory in which will be stored the received json files
- **url**: string that defines the url of the service


## Unrequired attributes
- **id**: string that represents the id
    - default: generates a GUID
- **enabled**: a boolean to enable or disable the task
    - default: true
- **outputDirectoryImages**: a string that defines the path of the directory in which will be stored the images found via the urls contained in the received json files. The url must contain "url_" as a substring to be marked as pointing to an image
    - default: ""
- **outputDirectoryInputs**: a string that defines the path of the directory in which will be stored the json files found via the urls contained in the received json files. The url must contain "input_" as a substring to be marked as pointing to an input json file
    - default: ""
- **outputDirectoryOutputs**: a string that defines the path of the directory in which will be stored the json files found via the urls contained in the received json files. The url must contain "output_" as a substring to be marked as pointing to an output json file
    - default: ""
- **enabledSaveImages**: a boolean to enable or disable images storage
    - default: false
- **enabledSaveInputs**: a boolean to enable or disable json inputs storage
    - default: false
- **enabledSaveOutputs**: a boolean to enable or disable json outputs storage
    - default: false
- **frontDefaultStringsMatcher**: a string used by the front part of Ml-Cli to get only the required images during annotation
    - default: ""
- **downloadStringsMatcher**: a string that allows the user to only download the images and jsons inputs/outputs that match the specified regex
    - default: ""
    - example: in the sample above, only the images of the urls containing "rotation" or "firstname" substrings will be saved
- **sortByFileType**: a boolean that defines in the recovered images are sorted by the related file name or by image type
    - default: true
    - example: if you sent a file called "fileName.jpg" to the service, and that service sends you the result of a rotation, with this parameter, you can decide whether the images will be stored in a sub repository called "fileName" or "rotation"
    - please note that the frontDefaultStringsMatcher only works with the attribute set to true
- **numberIteration**: an int that defines how many times the task will be executed
    - default: 1
- **numberParallel**: an int that defines how many calls to the service can be done at the same time
    - default: 1
    - example: if you more than 3 files that will be sent to the service, and if numberParallel equals 2, two files will be sent at the same time. When the treatment for one of them ends, the third file will be sent, and so on.
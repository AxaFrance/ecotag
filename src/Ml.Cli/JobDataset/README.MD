# Dataset

Dataset is used to generate a dataset file which will contain all annotations (of a same, user-specified type and configuration) made on json files with the help of the webapp.

The resulting json file can be used as an input on the webapp page.

# Samples

tasks.json 
```sh
[
  {
      "type": "dataset",
      "enabled": false,
      "annotationType": "Ocr",
      "configuration": "[{\"name\": \"Date\", \"id\": 0}, {\"name\": \"City name\", \"id\": 1}]",
      "fileDirectory": "licenses\\output\\{start-date}\\jsons",
      "imageDirectory": "licenses\\output\\{start-date}\\images",
      "outputDirectory": "licenses\\output",
      "frontDefaultStringsMatcher": "rotation, orientation",
      "fileName": "dataset-{start-date}-ocr.json"
  	},
  	{
      "type": "dataset",
      "enabled": false,
      "annotationType": "TagOverText",
      "fileDirectory": "licenses\\output\\{start-date}\\jsons",
      "imageDirectory": "licenses\\output\\{start-date}\\images",
      "outputDirectory": "licenses\\output",
      "frontDefaultStringsMatcher": "rotation, orientation",
      "fileName": "dataset-{start-date}-tagovertext.json",
      "script": "try{\n    const new_data = [\n        {\n            \"annotation0\": {\n                \"labels\": {\n                    \"boundingBoxes\": [\n                        {\n                            \"id\": \"7ed8df70-9408-4b5a-b660-a36ef3447d02\",\n                            \"level\": 5,\n                            \"page_num\": 1,\n                            \"block_num\": 1,\n                            \"par_num\": 1,\n                            \"line_num\": 1,\n                            \"word_num\": 1,\n                            \"left\": 25,\n                            \"top\": 5,\n                            \"width\": 110,\n                            \"height\": 25,\n                            \"conf\": 73,\n                            \"text\": \"14.07.1981\"\n                        },\n                        {\n                            \"id\": \"7ed8df70-9408-4b5a-b660-a36ef3447d03\",\n                            \"level\": 3,\n                            \"page_num\": 1,\n                            \"block_num\": 2,\n                            \"par_num\": 1,\n                            \"line_num\": 1,\n                            \"word_num\": 1,\n                            \"left\": 145,\n                            \"top\": 5,\n                            \"width\": 109,\n                            \"height\": 28,\n                            \"conf\": 53,\n                            \"text\": \"Utopia city\"\n                        }\n                    ]\n                }\n            }\n        }\n    ];\n    rawBodyOutput = JSON.stringify(new_data);\n}\ncatch (e) {\n    rawBodyOutput = \"\"\n}"
  	}
] 
```


# Properties

## Mandatory attributes
- **type**: name of the task
- **annotationType**: string that defines the annotation type of the file
    - values: "JsonEditor", "Ocr", "Cropping", "Rotation", "TagOverText", "TagOverTextLabel", "NamedEntityRecognition"
- **fileDirectory**: string that defines the path to the jsons used to generate the dataset
- **imageDirectory**: a string that defines the path to the directory where are stored the images that will be used to annotate. If the annotation type uses only one image, the first image of the repository will be used
- **outputDirectory**: string that defines the path where the dataset file will be generated
- **fileName**: string that defines the name of the file and its extension  
    
## Unrequired attributes
- **id**: string that represents the id
    - default: generates a GUID
- **enabled**: a boolean to enable or disable the task
    - default: true
- **configuration**: string that defines the configuration of the annotation system
    - default: ""
- **frontDefaultStringsMatcher**: a string used by the front part of Ml-Cli to get only the required images during annotation
    - default: ""
- **script**: string that defines a script used to provide a default annotation that will be used by the TagOverText and TagOverTextLabel annotation types to generate the default bounding boxes used to annotate
    - default: ""
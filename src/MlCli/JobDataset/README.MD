# Dataset

Dataset is used to generate a dataset file which will contain all annotations (of a same, user-specified type and
configuration) made on json files with the help of the webapp.

The resulting json file can be used as an input on the webapp page.

# Samples

tasks.json

```sh
[
  {
  		"type": "dataset",
  		"enabled": true,
  		"annotationType": "JsonEditor",
  		"fileDirectory": "licenses\\output\\{start-date}\\jsons",
  		"imageDirectory": "licenses\\output\\{start-date}\\images",
  		"outputDirectory": "licenses\\datasets",
  		"fileName": "dataset-{start-date}-jsoneditor.json"
  	},
  	{
  		"type": "dataset",
  		"enabled": true,
  		"annotationType": "Cropping",
  		"configuration": "[{\"id\": 1, \"name\":\"recto_lib\"},{\"id\": 2, \"name\":\"verso_lib\"},{\"id\": 3, \"name\":\"verso_lib1\"}]",
  		"fileDirectory": "licenses\\output\\{start-date}\\jsons",
  		"imageDirectory": "licenses\\output\\{start-date}\\images",
  		"outputDirectory": "licenses\\datasets",
  		"fileName": "dataset-{start-date}-cropping.json"
  	},
  	{
  		"type": "dataset",
  		"enabled": true,
  		"annotationType": "Rotation",
  		"fileDirectory": "licenses\\output\\{start-date}\\jsons",
  		"imageDirectory": "licenses\\output\\{start-date}\\images",
  		"outputDirectory": "licenses\\datasets",
  		"fileName": "dataset-{start-date}-rotation.json"
  	},
  	{
  		"type": "dataset",
  		"enabled": true,
  		"annotationType": "Ocr",
  		"configuration": "[{\"name\": \"Date\", \"id\": 0}, {\"name\": \"City name\", \"id\": 1}]",
  		"fileDirectory": "licenses\\output\\{start-date}\\jsons",
  		"imageDirectory": "licenses\\output\\{start-date}\\images",
  		"outputDirectory": "licenses\\datasets",
  		"frontDefaultStringsMatcher": "rotation, orientation",
  		"fileName": "dataset-{start-date}-ocr.json"
  	},
  	{
  		"type": "dataset",
  		"enabled": true,
  		"annotationType": "TagOverTextLabel",
  		"fileDirectory": "licenses\\output\\{start-date}\\jsons",
  		"imageDirectory": "licenses\\output\\{start-date}\\images",
  		"outputDirectory": "licenses\\datasets",
  		"frontDefaultStringsMatcher": "url_file_new_birthdate",
  		"fileName": "dataset-{start-date}-tagovertextlabel.json",
  		"configuration": "[{\"id\": 1, \"name\":\"recto_lib\"},{\"id\": 2, \"name\":\"verso_lib\"},{\"id\": 3, \"name\":\"verso_lib1\"}]",
  		"script": "try {\n    var dataBody = JSON.parse(rawBodyInput);\n\tconst boundingBoxInfo = dataBody.analysis[0].elements[0].output_new_verso_zone[0];\n\tconst new_data = [{\"labels\": {\"boundingBoxes\":[{\"id\": 0, \"level\": 1, \"page_num\": 1, \"block_num\": 1, \"par_num\": 1, \"line_num\": 1, \"word_num\": 1, \"left\": boundingBoxInfo.coordinates.xmin, \"top\": boundingBoxInfo.coordinates.ymin, \"width\": boundingBoxInfo.coordinates.xmax - boundingBoxInfo.coordinates.xmin, \"height\": boundingBoxInfo.coordinates.ymax - boundingBoxInfo.coordinates.ymin, \"conf\": boundingBoxInfo.confidence, \"text\": boundingBoxInfo.label}]}}];\n    rawBodyOutput = JSON.stringify(new_data);\n} catch(ex) {\n    console.log(\"Parsing failed\");\n    console.log(ex.toString());\n    rawBodyOutput = rawBodyInput;\n}"
  	},
  	{
  		"type": "dataset",
  		"enabled": true,
  		"annotationType": "TagOverText",
  		"fileDirectory": "licenses\\output\\{start-date}\\jsons",
  		"imageDirectory": "licenses\\output\\{start-date}\\images",
  		"outputDirectory": "licenses\\datasets",
  		"frontDefaultStringsMatcher": "url_file_new_birthdate",
  		"fileName": "dataset-{start-date}-tagovertext.json",
  		"script": "try {\n    var dataBody = JSON.parse(rawBodyInput);\n\tconst boundingBoxInfo = dataBody.analysis[0].elements[0].output_new_verso_zone[0];\n\tconst new_data = [{\"labels\": {\"boundingBoxes\":[{\"id\": 0, \"level\": 1, \"page_num\": 1, \"block_num\": 1, \"par_num\": 1, \"line_num\": 1, \"word_num\": 1, \"left\": boundingBoxInfo.coordinates.xmin, \"top\": boundingBoxInfo.coordinates.ymin, \"width\": boundingBoxInfo.coordinates.xmax - boundingBoxInfo.coordinates.xmin, \"height\": boundingBoxInfo.coordinates.ymax - boundingBoxInfo.coordinates.ymin, \"conf\": boundingBoxInfo.confidence, \"text\": boundingBoxInfo.label}]}}];\n    rawBodyOutput = JSON.stringify(new_data);\n} catch(ex) {\n    console.log(\"Parsing failed\");\n    console.log(ex.toString());\n    rawBodyOutput = rawBodyInput;\n}"
  	},
    {
        "type": "dataset",
        "enabled": true,
        "annotationType": "ImageClassifier",
        "fileDirectory": "licenses/output/{start-date}/jsons",
        "imageDirectory": "licenses/output/{start-date}/images",
        "outputDirectory": "licenses/datasets",
        "frontDefaultStringsMatcher": "recto_rotation",
        "configuration": "[{\"name\": \"Dog\"}, {\"name\": \"Cat\"}, {\"name\": \"Other\"}]",
        "fileName": "dataset-{start-date}-imageclassifier.json"
    }
] 
```

# Properties

## Mandatory attributes

- **type**: name of the task
- **annotationType**: string that defines the annotation type of the file
    - values: "JsonEditor", "Ocr", "Cropping", "Rotation", "TagOverText", "TagOverTextLabel", "
      NamedEntityRecognition", "ImageClassifier"
- **fileDirectory**: string that defines the path to the jsons used to generate the dataset
- **outputDirectory**: string that defines the path where the dataset file will be generated
- **fileName**: string that defines the name of the file and its extension

## Unrequired attributes

- **id**: string that represents the id
    - default: generates a GUID
- **enabled**: a boolean to enable or disable the task
    - default: true
- **configuration**: string that defines the configuration of the annotation system
    - default: ""
- **imageDirectory**: a string that defines the path to the directory where are stored the images that will be used to
  annotate. If the annotation type uses only one image, the first image of the repository will be used
    - default: ""
- **frontDefaultStringsMatcher**: a string used by the front part of Ml-Cli to get only the required images during
  annotation
    - default: ""
- **script**: string that defines a script used to provide a default annotation that will be used by the TagOverText and
  TagOverTextLabel annotation types to generate the default bounding boxes used to annotate
    - default: ""
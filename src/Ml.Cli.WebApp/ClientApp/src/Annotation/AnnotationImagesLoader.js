import React, {useEffect, useState} from "react";
import {fetchGetData, fetchPostJson} from "../FetchHelper";
import {useMutation} from "react-query";
import CroppingLazy from "./Toolkit/BoundingBox/CroppingLazy";
import OcrLazy from "./Toolkit/Ocr/OcrLazy";
import JsonEditorContainer from "./Toolkit/JsonEditor/JsonEditor.container";
import TagOverTextLabelLazy from "./Toolkit/TagOverTextLabel/TagOverTextLabelLazy";
import TagOverTextLazy from "./Toolkit/TagOverText/TagOverTextLazy";
import IrotLazy from "./Toolkit/Rotation/IrotLazy";
import NamedEntityLazy from "./Toolkit/NamedEntity/NamedEntityLazy";

const fetchImages = async data => {
    if (data.status === 200) {
        const hardDriveLocations = await data.json();
        return hardDriveLocations.map(element => {
            return `api/files/${new URLSearchParams({
                value: element
            })}`;
        });
    } else {
        return [];
    }
};

const getImages = (fetchFunction) => async (item) => {
    const params = {
        fileName: item.fileName,
        stringsMatcher: item.frontDefaultStringsMatcher,
        directory: item.imageDirectory
    };
    const fetchResult = await fetchGetData(fetchFunction)("api/datasets", params);
    return fetchImages(fetchResult);
};

const getHttpResultItem = async (item, fetchFunction) => {
    const params = {
        filePath: `${item.fileDirectory}\\${item.fileName}`
    };
    const fetchResult = await fetchGetData(fetchFunction)("api/annotations", params);
    if (fetchResult.status === 200) {
        const dataObject = await fetchResult.json();
        return {httpResult: dataObject, errorMessage: ""};
    }
    const errorMessage = `Requête invalide: ${fetchResult.statusText}`;
    return {errorMessage, httpResult: {}};
};

const AnnotationImagesLoader = ({item, MonacoEditor, parentState, fetchFunction}) => {

    const [state, setState] = useState({
        fileUrls: [],
        filePrimaryUrl: "",
        httpResultItem: {},
        errorMessage: "",
        isFetched: false
    });

    const mutationDataset = useMutation(newData => fetchPostJson(fetchFunction)("/api/annotations", newData));

    const getUrls = async () => {
        const newUrls = await getImages(fetchFunction)(item);
        const newFileUrl = newUrls != null ? newUrls[0] : "";
        return {fileUrls: newUrls, filePrimaryUrl: newFileUrl};
    };

    const getEditorContent = async () => {
        const {httpResult, errorMessage} = await getHttpResultItem(item, fetchFunction);
        return {errorMessage, httpResultItem: httpResult, isFetched: true};
    };
    
    const getBoundingBoxes = () => {
        let boundingBoxes;
        try{
            const annotationsArray = JSON.parse(item.annotations);
            const lastAnnotation = annotationsArray[annotationsArray.length - 1];
            const labels = lastAnnotation.labels;
            boundingBoxes = labels.boundingBoxes;
        }
        catch (ex){
            boundingBoxes = [];
        }
        return boundingBoxes;
    }

    useEffect(() => {
        let isMounted = true;
        getUrls().then(urls => {
            getEditorContent().then(content => {
                if (isMounted) {
                    setState({
                        fileUrls: urls.fileUrls,
                        filePrimaryUrl: urls.filePrimaryUrl,
                        errorMessage: content.errorMessage,
                        httpResultItem: content.httpResultItem,
                        isFetched: content.isFetched
                    });
                }
            })
        });
        return () => {
            isMounted = false;
        }
    }, []);

    const setAnnotationObject = e => {
        let returnedObject;
        switch (parentState.annotationType) {
            case "JsonEditor":
                returnedObject = {
                    "content": e
                };
                break;
            case "Ocr":
                returnedObject = {
                    "type": e.type,
                    "width": e.width,
                    "height": e.height,
                    "labels": e.labels
                };
                break;
            case "Cropping":
                returnedObject = {
                    "type": e.type,
                    "width": e.width,
                    "height": e.height,
                    "labels": e.labels
                };
                break;
            case "Rotation":
                returnedObject = {
                    "type": e.type,
                    "width": e.width,
                    "height": e.height,
                    "labels": e.labels,
                    "image_anomaly": e.image_anomaly
                }
                break;
            case "TagOverText":
                returnedObject = {
                    "type": e.type,
                    "width": e.width,
                    "height": e.height,
                    "labels": e.labels
                }
                break;
            case "TagOverTextLabel":
                returnedObject = {
                    "type": e.type,
                    "width": e.width,
                    "height": e.height,
                    "labels": e.labels
                };
                break;
            case "NamedEntityRecognition":
                returnedObject = e;
                break;
        }
        return returnedObject;
    }

    const onDatasetSubmit = e => {
        const annotationObject = {
            datasetLocation: parentState.datasetLocation,
            annotationType: parentState.annotationType,
            fileName: item.fileName,
            annotation: setAnnotationObject(e)
        };
        mutationDataset.mutate(annotationObject);
    }

    return (
        <>
            {parentState.annotationType === "JsonEditor" &&
            <>
                {!state.isFetched &&
                    <div>Loading editor...</div>
                }
                {state.isFetched &&
                    <JsonEditorContainer
                        expectedOutput={{id: item.id, fileName: item.fileName, value: state.httpResultItem.body}}
                        urls={state.fileUrls}
                        onSubmit={onDatasetSubmit}
                        MonacoEditor={MonacoEditor}
                    />
                }
                {state.errorMessage &&
                    <div className="error-message">{state.errorMessage}</div>
                }
            </>
            }
            {parentState.annotationType === "Ocr" &&
            <OcrLazy
                labels={parentState.configuration}
                expectedLabels={[]}
                url={state.filePrimaryUrl}
                onSubmit={onDatasetSubmit}
            />
            }
            {parentState.annotationType === "Cropping" &&
            <CroppingLazy
                labels={parentState.configuration}
                url={state.filePrimaryUrl}
                onSubmit={onDatasetSubmit}
            />
            }
            {parentState.annotationType === "Rotation" &&
                <IrotLazy
                    expectedLabels={[]}
                    url={state.filePrimaryUrl}
                    onSubmit={onDatasetSubmit}
                />
            }
            {parentState.annotationType === "TagOverText" &&
                <TagOverTextLazy
                    expectedOutput={getBoundingBoxes()}
                    url={state.filePrimaryUrl}
                    onSubmit={onDatasetSubmit}
                />
            }
            {parentState.annotationType === "TagOverTextLabel" &&
                <TagOverTextLabelLazy
                    expectedOutput={getBoundingBoxes()}
                    url={state.filePrimaryUrl}
                    onSubmit={onDatasetSubmit}
                    labels={parentState.configuration}
                />
            }
            {parentState.annotationType === "NamedEntityRecognition" &&
                <NamedEntityLazy
                    text={"This is some sample text. The NER is currently in a 'Work In Progress' state."}
                    labels={parentState.configuration}
                    annotationAction={onDatasetSubmit}
                    placeholder="Submit Annotation"
                />
            }
        </>
    );
};

export default AnnotationImagesLoader;

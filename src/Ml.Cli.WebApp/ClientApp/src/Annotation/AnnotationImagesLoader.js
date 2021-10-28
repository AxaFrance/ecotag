import React, {useEffect, useState} from "react";
import {fetchGetData, fetchPostJson, utf8_to_b64} from "../FetchHelper";
import {useMutation} from "react-query";
import CroppingLazy from "./Toolkit/BoundingBox/CroppingLazy";
import OcrLazy from "./Toolkit/Ocr/OcrLazy";
import JsonEditorContainer from "./Toolkit/JsonEditor/JsonEditor.container";
import TagOverTextLabelLazy from "./Toolkit/TagOverTextLabel/TagOverTextLabelLazy";
import TagOverTextLazy from "./Toolkit/TagOverText/TagOverTextLazy";
import IrotLazy from "./Toolkit/Rotation/IrotLazy";
import NamedEntityLazy from "./Toolkit/NamedEntity/NamedEntityLazy";
import {toast} from "react-toastify";
import ImageClassifierLazy from "./Toolkit/ImageClassifier/ImageClassifierLazy";


const fetchImages = async data => {
    if (data.status === 200) {
        const hardDriveLocations = await data.json();
        return hardDriveLocations.map(element => {
            return `api/files/${utf8_to_b64(element)}`;
        });
    } else {
        return [];
    }
};

const getImages = (fetchFunction) => async (item) => {
    const params = "fileName=" + item.fileName + "&stringsMatcher="+ item.frontDefaultStringsMatcher + "&directory=" + item.imageDirectory
    const fetchResult = await fetchGetData(fetchFunction)("api/datasets/"+utf8_to_b64(params));
    return fetchImages(fetchResult);
};

const getHttpResultItem = async (item, fetchFunction) => {
    let pathSeparator = "\\";
    if(item.fileDirectory.includes("/")){
        pathSeparator = "/";
    }
   const filePath = `${item.fileDirectory}${pathSeparator}${item.fileName}`
    
    const fetchResult = await fetchGetData(fetchFunction)("api/annotations/"+utf8_to_b64(filePath));
    if (fetchResult.status === 200) {
        const dataObject = await fetchResult.json();
        return {httpResult: dataObject, errorMessage: ""};
    }
    const errorMessage = `Requête invalide: ${fetchResult.statusText}`;
    return {errorMessage, httpResult: {}};
};

const sendConfirmationMessage = (isSuccess) => {
    const message = isSuccess ? "Annotation saved" : "Impossible to save annotation";
    const type = isSuccess ? "success" : "error";
    toast(message, {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: false,
        draggable: true,
        progress: undefined,
        type: type
    });
}

const AnnotationImagesLoader = ({item, MonacoEditor, parentState, onSubmit, fetchFunction}) => {

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
        if(parentState.annotationType === "NamedEntityRecognition"){
            return;
        }
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
            case "ImageClassifier":
                returnedObject = {
                    "label": e
                };
                break;
        }
        return returnedObject;
    }

    const onDatasetSubmit = async e => {
        const annotationObject = {
            datasetLocation: parentState.datasetLocation,
            annotationType: parentState.annotationType,
            fileName: item.fileName,
            annotation: setAnnotationObject(e)
        };
        await mutationDataset.mutateAsync(annotationObject, {
            onSuccess: () => sendConfirmationMessage(true),
            onError: () => sendConfirmationMessage(false)
        });
        onSubmit();
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
                    text={"Hello, my name is Lilian Delouvy, and this is some sample text.  The NER is currently in a 'Work In Progress' state. And it will be awesome. bla bla . bla bla . bla bla . bla bla . bla bla "}
                    labels={parentState.configuration}
                    annotationAction={onDatasetSubmit}
                    placeholder="Submit Annotation"
                />
            }
            {parentState.annotationType === "ImageClassifier" &&
                <ImageClassifierLazy
                    url={state.filePrimaryUrl}
                    labels={parentState.configuration}
                    onSubmit={onDatasetSubmit}
                />
            }
        </>
    );
};

export default AnnotationImagesLoader;

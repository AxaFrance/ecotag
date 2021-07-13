import React, {useEffect, useState} from "react";
import {fetchGetData, fetchPostJson} from "../FetchHelper";
import {useMutation} from "react-query";
import CroppingLazy from "./Toolkit/BoundingBox/CroppingLazy";
import OcrLazy from "./Toolkit/Ocr/OcrLazy";
import JsonEditorContainer from "./Toolkit/JsonEditor/JsonEditor.container";
import IrotContainer from "./Toolkit/Rotation";

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
        stringsMatcher: "",
        directory: item.imageDirectory
    };
    const fetchResult = await fetchGetData(fetchFunction)(params, "api/datasets");
    return fetchImages(fetchResult);
};

const getHttpResultItem = async (item, fetchFunction) => {
    const params = {
        filePath: `${item.fileDirectory}\\${item.fileName}`
    };
    const fetchResult = await fetchGetData(fetchFunction)(params, "api/annotations");
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

    const mutationJson = useMutation(newData => fetchPostJson(fetchFunction)("/api/datasets/save", newData));
    const mutationDataset = useMutation(newData => fetchPostJson(fetchFunction)("/api/annotations/save", newData));

    const getUrls = async () => {
        const newUrls = await getImages(fetchFunction)(item);
        const newFileUrl = newUrls != null ? newUrls[0] : "";
        return {fileUrls: newUrls, filePrimaryUrl: newFileUrl};
    };

    const getEditorContent = async () => {
        const {httpResult, errorMessage} = await getHttpResultItem(item, fetchFunction);
        return {errorMessage, httpResultItem: httpResult, isFetched: true};
    };

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

    const saveJsonEditor = editorContent => {
        const newHttpResultItem = state.httpResultItem;
        newHttpResultItem.body = editorContent;
        mutationJson.mutate(newHttpResultItem);
        setState({...state, httpResultItem: newHttpResultItem});
    };

    const setAnnotationObject = e => {
        let returnedObject;
        switch (parentState.annotationType) {
            case "JsonEditor":
                saveJsonEditor(e);
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
                    <div>Chargement de l'éditeur...</div>
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
                <IrotContainer
                    expectedLabels={[]}
                    url={state.filePrimaryUrl}
                    onSubmit={e => console.log(e)}
                />
            }
        </>
    );
};

export default AnnotationImagesLoader;

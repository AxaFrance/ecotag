import React, {useEffect, useState} from "react";
import {fetchGetData, fetchPostJson} from "../FetchHelper";
import {useMutation} from "react-query";
import CroppingLazy from "./Toolkit/BoundingBox/CroppingLazy";
import OcrLazy from "./Toolkit/Ocr/OcrLazy";
import EditorContainer from "./Toolkit/JsonEditor/EditorContainer";

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

const AnnotationImagesLoader = ({item, expectedOutput, onSubmit, MonacoEditor, parentState, fetchFunction}) => {

    const [state, setState] = useState({
        fileUrls: [],
        filePrimaryUrl: ""
    });
    
    const mutationDataset = useMutation(newData => fetchPostJson(fetchFunction)("/api/annotations/save", newData));

    const getUrls = async () => {
        const newUrls = await getImages(fetchFunction)(item);
        const newFileUrl = newUrls != null ? newUrls[0] : "";
        return {fileUrls: newUrls, filePrimaryUrl: newFileUrl};
    };

    useEffect(() => {
        let isMounted = true;
        getUrls().then(obj => {
            if(isMounted){
                setState({fileUrls: obj.fileUrls, filePrimaryUrl: obj.filePrimaryUrl});
            }
        });
        return () => {
            isMounted = false;
        }
    }, []);
    
    const setAnnotationObject = e => {
        let returnedObject;
        switch (parentState.annotationType){
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
            {parentState.annotationType === "Annotation" &&
                <EditorContainer
                    expectedOutput={expectedOutput}
                    urls={state.fileUrls}
                    onSubmit={onSubmit}
                    MonacoEditor={MonacoEditor}
                />
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
        </>
    );
};

export default AnnotationImagesLoader;

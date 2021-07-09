import React, {useEffect, useState} from "react";
import EditorContainer from "../Editor/EditorContainer";
import {fetchGetData, fetchPostJson} from "../FetchHelper";
import OcrContainer from "./Toolkit/Ocr";
import {useMutation} from "react-query";
import CroppingContainer from "./Toolkit/BoundingBox/CroppingContainer";

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
        setState({fileUrls: newUrls, filePrimaryUrl: newFileUrl});
    };

    useEffect(() => {
        getUrls();
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
                <OcrContainer
                    labels={parentState.configuration}
                    expectedLabels={[]}
                    url={state.filePrimaryUrl}
                    onSubmit={onDatasetSubmit}
                />
            }
            {parentState.annotationType === "Cropping" &&
                <CroppingContainer
                    labels={parentState.configuration}
                    url={state.filePrimaryUrl}
                    onSubmit={onDatasetSubmit}
                />
            }
        </>
    );
};

export default AnnotationImagesLoader;

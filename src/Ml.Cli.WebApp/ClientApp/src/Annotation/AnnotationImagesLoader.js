import React, {useEffect, useState} from "react";
import EditorContainer from "../Editor/EditorContainer";
import {fetchGetData, fetchPostJson} from "../FetchHelper";
import OcrContainer from "./Toolkit/Ocr";
import {useMutation} from "react-query";

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
    const fetchResult = await fetchGetData(fetchFunction)("api/datasets", params);
    return fetchImages(fetchResult);
};

const AnnotationImagesLoader = ({item, expectedOutput, onSubmit, MonacoEditor, parentState, fetchFunction}) => {

    const [state, setState] = useState({
        fileUrls: [],
        filePrimaryUrl: ""
    });
    
    const mutationDataset = useMutation(newData => fetchPostJson(newData, fetchFunction)("/api/annotations/save"));

    const getUrls = async () => {
        const newUrls = await getImages(fetchFunction)(item);
        let newFileUrl;
        if(newUrls != null){
            newFileUrl = newUrls[0];
        }
        else{
            newFileUrl = "";
        }
        setState({fileUrls: newUrls, filePrimaryUrl: newFileUrl});
    };

    useEffect(() => {
        getUrls();
    }, []);

    const labels =   [{name: "Recto", color: "#212121", id: 0}, {name: "Verso", color: "#ffbb00", id: 1}];
    const onOcrSubmit = (e) => {
        console.log("Submit Method", e);
        const annotationObject = {
            datasetLocation: parentState.datasetLocation,
            annotationType: parentState.annotationType,
            annotation: {
                "type": e.type,
                "width": e.width,
                "height": e.height,
                "labels": {
                    "recto": e.labels.Recto,
                    "verso": e.labels.Verso
                }
            }
        };
        mutationDataset.mutate(annotationObject);
    };
    
    return (
        <>
            <EditorContainer
                expectedOutput={expectedOutput}
                urls={state.fileUrls}
                onSubmit={onSubmit}
                MonacoEditor={MonacoEditor}
            />
            {parentState.annotationType === "Ocr" &&
                <OcrContainer
                    labels={labels}
                    expectedLabels={[]}
                    url={state.filePrimaryUrl}
                    onSubmit={onOcrSubmit}
                />
            }
        </>
    );
};

export default AnnotationImagesLoader;

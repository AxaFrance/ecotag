import React, {useEffect, useState} from "react";
import EditorContainer from "../Editor/EditorContainer";
import {fetchGetData} from "../FetchHelper";
import OcrContainer from "./Toolkit/Ocr";
import url from "./Toolkit/Ocr/sample_rib.png";

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

const AnnotationImagesLoader = ({item, expectedOutput, onSubmit, MonacoEditor, fetchFunction}) => {

    const [state, setState] = useState({
        fileUrls: []
    });

    const getUrls = async () => {
        const newUrls = await getImages(fetchFunction)(item);
        setState({fileUrls: newUrls});
    };

    useEffect(() => {
        getUrls();
    }, []);

    const labels =   [{name: "Recto", color: "#212121", id: 0}, {name: "Verso", color: "#ffbb00", id: 1}, {name: "Signature", color: "#f20713", id: 2}];
    const onOcrSubmit = (e) => {
        console.log("Submit Method", e);
    };
    
    return (
        <>
            <EditorContainer
                expectedOutput={expectedOutput}
                urls={state.fileUrls}
                onSubmit={onSubmit}
                MonacoEditor={MonacoEditor}
            />
            <OcrContainer
                labels={labels}
                expectedLabels={[]}
                url={url}
                onSubmit={onOcrSubmit}
            />
        </>
    );
};

export default AnnotationImagesLoader;

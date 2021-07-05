import React, {useEffect, useState} from "react";
import EditorContainer from "../Editor/EditorContainer";
import {fetchGetData} from "../FetchHelper";

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

const getImages = async (item, fetchFunction) => {
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
        const newUrls = await getImages(item, fetchFunction);
        setState({fileUrls: newUrls});
    };

    useEffect(() => {
        getUrls();
    }, []);

    return (
        <EditorContainer
            expectedOutput={expectedOutput}
            urls={state.fileUrls}
            onSubmit={onSubmit}
            MonacoEditor={MonacoEditor}
        />
    );
};

export default AnnotationImagesLoader;

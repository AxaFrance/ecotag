import React, {useEffect, useState} from "react";
import EditorContainer from "../Editor/EditorContainer";
import {fetchGetData} from "../FetchHelper";

const fetchImages = async data => {
    if (data.status === 200) {
        const hardDriveLocations = await data.json();
        return hardDriveLocations.map(element => {
            return `/api/files/${new URLSearchParams({
                value: element
            })}`;
        });
    } else {
        return [];
    }
};

export const getImages = async (item, stringsMatcher, direction, fetchFunction) => {
    const params = {
        fileName: item.fileName,
        stringsMatcher: (!stringsMatcher ? item.right.FrontDefaultStringsMatcher : stringsMatcher),
        directory: (direction === "left" ? item.left.ImageDirectory : item.right.ImageDirectory)
    };
    const fetchResult = await fetchGetData(fetchFunction)(params, "api/datasets");
    return fetchImages(fetchResult);
};

const ImagesLoader = ({item, stringsMatcher, direction, fetchFunction, expectedOutput, onSubmit, MonacoEditor}) => {

    const [state, setState] = useState({
        fileUrls: []
    });

    useEffect(() => {
        let isMounted = true;
        getImages(item, stringsMatcher, direction, fetchFunction)
            .then(urls => {
                if(isMounted){
                    setState({fileUrls: urls});
                }
        });
        return () => {
            isMounted = false;
        }
    }, [stringsMatcher]);

    return <EditorContainer
        expectedOutput={expectedOutput}
        urls={state.fileUrls}
        onSubmit={onSubmit}
        MonacoEditor={MonacoEditor}
    />;
};

export default ImagesLoader;

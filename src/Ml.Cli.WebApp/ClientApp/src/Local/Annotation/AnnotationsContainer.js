import React, {useEffect, useState} from "react";

import {useHistory} from "react-router";
import {useMutation} from "react-query";
import {fetchGetData, fetchPostJson, utf8_to_b64} from "../FetchHelper";
import {toast} from "react-toastify";
import Annotations from "../../Toolkit/Annotations/Annotations";

const selectItemById = (annotationState, id) => {
    if(id === "end")
        return null;
    if(id === "empty")
        return null;
    return annotationState.items.find(x => x.id === id);
};


const fetchImages = async data => {
    if (data.status === 200) {
        const hardDriveLocations = await data.json();
        return hardDriveLocations.map(element => {
            return `api/local/files/${utf8_to_b64(element)}`;
        });
    } else {
        return [];
    }
};

const getImages = (fetch) => async (item) => {
    const params = "fileName=" + item.fileName + "&stringsMatcher="+ item.frontDefaultStringsMatcher + "&directory=" + item.imageDirectory
    const fetchResult = await fetchGetData(fetch)("api/local/datasets/"+utf8_to_b64(params));
    return fetchImages(fetchResult);
};

const sendConfirmationMessage = (isSuccess) => {
    const message = isSuccess ? "Annotation saved" : "Impossible to save annotation";
    const type = isSuccess ? "success" : "error";
    toast(message, {
        position: "top-left",
        autoClose: 800,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: false,
        draggable: true,
        progress: undefined,
        type: type
    });
}


const AnnotationsContainer = ({state, id, url, dataset, fetch}) => {
    const history = useHistory();
    
    const item = selectItemById(state, id);
    const itemNumber= state.items.indexOf(item);
    
    const onSubmit = async (annotation) => {
        const annotationObject = {
            datasetLocation: state.datasetLocation,
            annotationType: state.annotationType,
            fileName: item.fileName,
            annotation: annotation
        };
        await mutationDataset.mutateAsync(annotationObject, {
            onSuccess: () => {
                sendConfirmationMessage(true);
                onNext();
            },
            onError: () => sendConfirmationMessage(false)
        });
    }
    
    const onPrevious = () => {
        if(id === "end"){
            history.push(`${url}/${dataset}/${state.items[state.items.length - 1].id}`);
        } else{
            history.push(`${url}/${dataset}/${state.items[itemNumber - 1].id}`);
        }
    };
    
    const onNext = () => {
        if((itemNumber + 1) < state.items.length){
            history.push(`${url}/${dataset}/${state.items[itemNumber + 1].id}`);
        } else {
            history.push(`${url}/${dataset}/end`);
        }
    };

    const isPreviousDisabled = itemNumber === 0;
    const isNextDisabled = item == null;

    const [localState, setState] = useState({
        filePrimaryUrl: "",
    });

    const mutationDataset = useMutation(newData => fetchPostJson(fetch)("/api/local/annotations", newData));

    const getUrls = async () => {
        const newUrls = await getImages(fetch)(item);
        const newFileUrl = newUrls != null ? newUrls[0] : "";
        return {fileUrls: newUrls, filePrimaryUrl: newFileUrl};
    };

    const getBoundingBoxes = () => {
        if(item && item.annotations){
            const annotationsArray = JSON.parse(item.annotations);
            const lastAnnotation = annotationsArray[annotationsArray.length - 1];
            return lastAnnotation.labels.boundingBoxes;
        }
        return null;
    }

    useEffect(() => {
        setState({
            filePrimaryUrl: "",
        })
        if(!item || !item.imageDirectory){
            return;
        }
        getUrls().then(urls => {
                setState({
                    filePrimaryUrl: urls.filePrimaryUrl,
            })
        });
    }, [id]);
    
    
    const toolbarText = item ? item.fileName: "";
    const annotationType = state.annotationType;
    const labels = state.configuration;
    const expectedOutput = getBoundingBoxes();

    return <Annotations
            onPrevious={onPrevious}
            isPreviousDisabled={isPreviousDisabled}
            onNext={onNext}
            toolbarText={toolbarText}
            isEmpty={state.items.length <= 0}
            isNextDisabled={isNextDisabled}
            url={localState.filePrimaryUrl}
            annotationType={annotationType}
            labels={labels}
            expectedOutput={expectedOutput}
            onSubmit={onSubmit}
        />;
};

export default React.memo(AnnotationsContainer);

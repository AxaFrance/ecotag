import React, {useEffect, useState} from "react";
import AnnotationSwitch from "./AnnotationSwitch";
import AnnotationsToolbar from "./AnnotationsToolbar";
import './AnnotationsContainer.scss';
import {useHistory} from "react-router";
import {useMutation} from "react-query";
import {fetchGetData, fetchPostJson, utf8_to_b64} from "../FetchHelper";
import {toast} from "react-toastify";

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

const AnnotationsContainer = ({state, id, url, dataset, fetchFunction}) => {
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
    console.log(item);

    const mutationDataset = useMutation(newData => fetchPostJson(fetchFunction)("/api/annotations", newData));

    const getUrls = async () => {
        const newUrls = await getImages(fetchFunction)(item);
        const newFileUrl = newUrls != null ? newUrls[0] : "";
        return {fileUrls: newUrls, filePrimaryUrl: newFileUrl};
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

    if(state.items.length <= 0){
        return <h2 className="error-message">The annotation file is empty.</h2>
    }

    return <>
        <AnnotationsToolbar
            onPrevious={onPrevious}
            isPreviousDisabled={isPreviousDisabled}
            onNext={onNext}
            text={item? item.fileName: ""}
            isNextDisabled={isNextDisabled}
        />
        {isNextDisabled ? (
            <h3 className="annotation__end-message">Thank you, all files from this dataset have been annotated.</h3>
        ) : (
            <AnnotationSwitch
                url={localState.filePrimaryUrl}
                annotationType={state.annotationType}
                labels={state.configuration}
                expectedOutput={getBoundingBoxes()}
                onSubmit={onSubmit}
            />
        )}
    </>;
};

export default React.memo(AnnotationsContainer);

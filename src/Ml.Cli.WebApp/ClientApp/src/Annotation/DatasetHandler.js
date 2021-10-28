import React, {useState} from "react";
import '../Comparison/Compare.scss';
import FileLoader from "../FileLoader/FileLoader";
import './DatasetHandler.scss';
import cuid from "cuid";

const mapDatasetItems = data => data.map(item => {
    return {
        id: cuid(),
        fileName: item.FileName,
        fileDirectory: item.FileDirectory,
        imageDirectory: item.ImageDirectory,
        frontDefaultStringsMatcher: item.FrontDefaultStringsMatcher,
        annotations: item.Annotations
    };
});

const sortByAnnotations = (items) => {
    return items.sort((a, b) => (a.annotations.length > b.annotations.length) ? 1 : -1);
}

const DatasetHandler = ({state, setState, history, fetchFunction}) => {

    const [handlerState, setHandlerState] = useState({
        loadFileError: false
    });

    const loadFile = (result, fileName) => {
        if (!result.hasOwnProperty('DatasetLocation')) {
            onLoadFailure(fileName);
        } else {
            const mappedItems = mapDatasetItems(result.Content);
            const sortedItems = sortByAnnotations(mappedItems);
            const location = result.DatasetLocation;
            const fileAnnotationType = result.AnnotationType;
            let fileConfiguration = "";
            if(result.Configuration !== ""){
                fileConfiguration = JSON.parse(result.Configuration);
            }
            setState({...state, fileName: fileName, datasetLocation: location, annotationType: fileAnnotationType, configuration: fileConfiguration, items: sortedItems, isFileInserted: true});
            if(sortedItems.length !== 0){
                history.push(`/annotate/${fileName}/${sortedItems[0].id}`);
            }
        }
    };

    const onLoadFailure = fileName => {
        setState({...state, fileName: fileName, items: []});
        setHandlerState({...state, loadFileError: true});
    };

    return (
        <>
            <FileLoader
                id="dataset_loader"
                name="placeDatasetFile"
                accept="application/json"
                onLoad={(reader, e) => loadFile(reader, e)}
                onFailure={e => onLoadFailure(e)}
                controllerPath="api/datasets"
                fetchFunction={fetchFunction}
            />
            {handlerState.loadFileError &&
            <h2 className="error-message">
                An error occured during file loading.
            </h2>
            }
        </>
    );
};

export default DatasetHandler;

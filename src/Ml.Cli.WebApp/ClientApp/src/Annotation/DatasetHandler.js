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

const DatasetHandler = ({state, setState, fetchFunction}) => {

    const [handlerState, setHandlerState] = useState({
        loadFileError: false
    });

    const loadFile = (result, fileName) => {
        if (!result.hasOwnProperty('DatasetLocation')) {
            onLoadFailure(fileName);
        } else {
            const mappedItems = mapDatasetItems(result.Content);
            const location = result.DatasetLocation;
            const fileAnnotationType = result.AnnotationType;
            let fileConfiguration = "";
            if(result.Configuration !== ""){
                fileConfiguration = JSON.parse(result.Configuration);
            }
            setState({...state, fileName: fileName, datasetLocation: location, annotationType: fileAnnotationType, configuration: fileConfiguration, items: mappedItems});
            setHandlerState({...state, loadFileError: false});
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
                fetchFunction={fetchFunction}
            />
            {handlerState.loadFileError &&
            <h2 className="error-message">
                Une erreur est survenue lors du chargement du fichier.
            </h2>
            }
        </>
    );
};

export default DatasetHandler;

import React, {useState} from "react";
import '../Comparison/Compare.scss';
import FileLoader from "../FileLoader/FileLoader";
import {Tabs} from "@axa-fr/react-toolkit-all";
import './DatasetHandler.scss';
import cuid from "cuid";
import {SelectBase} from "@axa-fr/react-toolkit-form-input-select";

const annotationTypesSelect = [
    {value: 'Ocr', label: 'Ocr'},
    {value: 'Cropping', label: 'Cropping'},
    {value: 'Rotation', label: 'Rotation'},
    {value: 'TagOverText', label: 'TagOverText'},
    {value: 'TagOverTextLabel', label: 'TagOverTextLabel'}
];


const mapDatasetItems = data => data.map(item => {
    return {
        id: cuid(),
        fileName: item.FileName,
        fileDirectory: item.FileDirectory,
        imageDirectory: item.ImageDirectory,
        annotations: item.Annotations
    };
});

const DatasetHandler = ({state, setState}) => {

    const [handlerState, setHandlerState] = useState({
        loadFileError: false
    });

    const loadFile = (reader, e) => {
        const result = JSON.parse(reader.result);
        if (!result.hasOwnProperty('DatasetLocation')) {
            onLoadFailure(e);
        } else {
            const mappedItems = mapDatasetItems(result.Content);
            const location = result.DatasetLocation;
            setState({...state, fileName: e.values[0].file.name, datasetLocation: location, items: mappedItems});
            setHandlerState({...state, loadFileError: false});
        }
    };

    const onLoadFailure = e => {
        setState({...state, fileName: e.values[0].file.name, items: []});
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
            />
            <div className="tabs">
                <Tabs className="tabs__header">
                    <Tabs.Tab title="Configuration">
                        <div>
                            <p className="tabs__title">Extensions de fichiers:</p>
                            <SelectBase
                                id="extension_type"
                                name="ExtensionType"
                                value={state.annotationType}
                                options={annotationTypesSelect}
                                onChange={e => {
                                    setState({...state, annotationType: e.value});
                                }}
                            />
                        </div>
                    </Tabs.Tab>
                </Tabs>
            </div>
            {handlerState.loadFileError &&
            <h2 className="error-message">
                Une erreur est survenue lors du chargement du fichier.
            </h2>
            }
        </>
    );
};

export default DatasetHandler;

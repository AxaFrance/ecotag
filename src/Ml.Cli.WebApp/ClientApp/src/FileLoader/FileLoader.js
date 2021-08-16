import {File} from "@axa-fr/react-toolkit-form-input-file";
import React from "react";
import './FileLoader.scss';
import Library from "../Library/Library";

const FileLoader = ({id, name, accept, onLoad, onFailure, fetchFunction}) => {

    const onFileLoad = e => {
        const input = e.values[0].file;
        if (input.size > 0) {
            const reader = new FileReader();
            reader.onloadend = async () => onLoad(JSON.parse(reader.result), e.values[0].file.name);
            reader.readAsText(input);
        } else {
            onFailure(e);
        }
    };
    
    const onLibraryLoad = e => {
        const compareLocation = e.CompareLocation;
        const fileName = compareLocation.replace(/^.*[\\\/]/, '');
        onLoad(e, fileName);
    }

    return (
        <div className="file-loader__container">
            <div className="file-loader__input">
                <File
                    id={id}
                    name={name}
                    accept={accept}
                    onChange={onFileLoad}
                    maxSize={2000000000}
                />
            </div>
            <Library
                fetchFunction={fetchFunction}
                onPlayClick={onLibraryLoad}
            />
        </div>
    );
};

export default FileLoader;

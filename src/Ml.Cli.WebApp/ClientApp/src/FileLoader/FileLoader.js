import {File} from "@axa-fr/react-toolkit-form-input-file";
import React from "react";
import './FileLoader.scss';
import Library from "../Library/Library";

const FileLoader = ({id, name, accept, onLoad, onFailure, fetchFunction}) => {

    const onLocalLoad = e => {
        const input = e.values[0].file;
        if (input.size > 0) {
            const reader = new FileReader();
            reader.onloadend = async () => onLoad(reader, e);
            reader.readAsText(input);
        } else {
            onFailure(e);
        }
    };

    return (
        <div className="file-loader__container">
            <div className="file-loader__input">
                <File
                    id={id}
                    name={name}
                    accept={accept}
                    onChange={onLocalLoad}
                    maxSize={2000000000}
                />
            </div>
            <Library
                fetchFunction={fetchFunction}
                onPlayClick={onLocalLoad}
            />
        </div>
    );
};

export default FileLoader;

import React, {useEffect, useState} from "react";
import "@axa-fr/react-toolkit-core/dist/assets/fonts/icons/af-icons.css";
import {fetchGetData, StatusCodes, b64_to_utf8} from "../../FetchHelper";
import {getDataPaths} from "../Comparison/ImagesLoader";
import './Library.scss';

const Regex = {
    SLASHES: /^.*[\\\/]/
};

export const StringContent = {
    EMPTY: '',
    SPACE: ' '
};

const getFiles = async (fetchFunction, controllerPath) => {
    const fetchResult = await fetchGetData(fetchFunction)(controllerPath);
    return await getDataPaths(fetchResult);
}

const Library = ({fetchFunction, onPlayClick, controllerPath}) => {

    const [state, setState] = useState({
        files: []
    });

    useEffect(() => {
        tick();
        const timerID = setInterval(
            () => tick(),
            5000
        );

        return function cleanup() {
            clearInterval(timerID);
        };
    }, []);

    const tick = () => {
        getFiles(fetchFunction, controllerPath)
            .then(files => {
                    setState({files});
                }
            );
    };

    const getFileName = filePath => {
        const splits = filePath.split("/");
        const fileName = b64_to_utf8(splits[splits.length-1]);
        return fileName.replace(Regex.SLASHES, StringContent.EMPTY);
    };
    
    const loadSelectedFile = async file => {
        const data = await fetchGetData(fetchFunction)(file);
        if(data.status === StatusCodes.OK){
            const dataContent = await data.json();
            onPlayClick(dataContent, getFileName(file));
        }
    }

    return (
        <div className="library__container">
            <p className="library__title">Files</p>
            {state.files.length === 0 &&
                <span>No file found.</span>
            }
            <div className="library__files-list">
                {state.files.map((file, index) => {
                    return (
                        <div key={index} className="library__file">
                            <a href={`${file}`} download={getFileName(file)}>
                                {getFileName(file)}
                            </a>
                            <span
                                onClick={() => loadSelectedFile(file)}
                                className="glyphicon glyphicon-play library__custom-glyphicon-play"
                            />
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default Library;

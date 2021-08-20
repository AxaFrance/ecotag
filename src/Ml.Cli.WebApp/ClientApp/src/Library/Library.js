import React, {useEffect, useState} from "react";
import "@axa-fr/react-toolkit-core/dist/assets/fonts/icons/af-icons.css";
import {fetchGetData, StatusCodes, StringEncoding} from "../FetchHelper";
import {getDataPaths} from "../Comparison/ImagesLoader";
import './Library.scss';

const Regex = {
    PLUS: /\+/g,
    SLASHES: /^.*[\\\/]/
};

export const StringContent = {
    EMPTY: '',
    SPACE: ' '
};

const API_ROUTE_LENGTH = 17;

const getFiles = async (fetchFunction) => {
    const fetchResult = await fetchGetData(fetchFunction)({}, "api/files");
    return await getDataPaths(fetchResult);
}

const Library = ({fetchFunction, onPlayClick}) => {

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
        getFiles(fetchFunction)
            .then(files => {
                    setState({files});
                }
            );
    };

    const getFileName = filePath => {
        const fileName = decodeURIComponent(filePath.replace(Regex.PLUS, StringContent.SPACE));
        return fileName.replace(Regex.SLASHES, StringContent.EMPTY);
    };
    
    const loadSelectedFile = async file => {
        const fileName = decodeURIComponent(file.replace(Regex.PLUS, StringContent.SPACE));
        const value = fileName
            .slice(API_ROUTE_LENGTH)
            //specific case of path containing a plus sign, which needs to be replaced as %2B to prevent it from being decoded as a space
            .replace(Regex.PLUS,StringEncoding.PLUS);
        const params = {
            value: encodeURI(value)
        };
        const data = await fetchGetData(fetchFunction)(params, "api/files");
        if(data.status === StatusCodes.OK){
            const dataContent = await data.json();
            onPlayClick(dataContent, getFileName(file));
        }
    }

    return (
        <div className="library__container">
            <p className="library__title">Fichiers de test</p>
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

import React, {useEffect, useState} from "react";
import "@axa-fr/react-toolkit-core/dist/assets/fonts/icons/af-icons.css";
import {fetchGetData} from "../FetchHelper";
import {getDataPaths} from "../Comparison/ImagesLoader";
import './Library.scss';

const getFiles = async fetchFunction => {
    const fetchResult = await fetchGetData(fetchFunction)({}, "api/compares");
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
                    setState({files: files});
                }
            );
    };

    const getFileName = filePath => {
        const decodedUri = decodeURIComponent(filePath.replace(/\+/g, ' '));
        return decodedUri.replace(/^.*[\\\/]/, '');
    };
    
    const loadSelectedFile = async e => {
        const decodedUri = decodeURIComponent(e.replace(/\+/g, ' '));
        const value = decodedUri.slice(17);
        const params = {
            value: value
        }
        const data = await fetchGetData(fetchFunction)(params, "api/files");
        if(data.status === 200){
            const dataContent = await data.json();
            onPlayClick(dataContent);
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
                            <a href={``} download={file}>
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

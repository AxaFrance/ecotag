import React, {useEffect, useState} from "react";
import "@axa-fr/react-toolkit-core/dist/assets/fonts/icons/af-icons.css";
import {fetchGetData} from "../FetchHelper";
import {fetchImages} from "../Comparison/ImagesLoader";
import './Library.scss';

const getFiles = async fetchFunction => {
    const fetchResult = await fetchGetData(fetchFunction)({}, "api/compares");
    return await fetchImages(fetchResult);
}

const Library = ({fetchFunction}) => {

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
        const decodedUri = decodeURI(filePath);
        return decodedUri.replace(/^.*[\\\/]/, '');
    };

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
                                onClick={e => console.log(e)}
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

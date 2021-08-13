import React, {useEffect, useState} from "react";
import "@axa-fr/react-toolkit-core/dist/assets/fonts/icons/af-icons.css";
import {fetchGetData} from "../FetchHelper";
import {fetchImages} from "../Comparison/ImagesLoader";

const getFiles = async fetchFunction => {
    const fetchResult = await fetchGetData(fetchFunction)({}, "api/compares");
    return await fetchImages(fetchResult);
}

const Library = ({fetchFunction}) => {
    
    const [state, setState] = useState({
        files: []
    })
    
    useEffect(() => {
        const timerID = setInterval(
            () => tick(),
            5000
        );
        
        return function cleanup(){
            clearInterval(timerID);
        }
    });
    
    const tick = () => {
        //utiliser isMounted comme dans ImagesLoader ?
        getFiles(fetchFunction)
            .then(files => {
                setState({files: files});
            }
        );
    }
    
    return (
        <>
            <p className="library__title">Fichiers de test</p>
            {state.files.map((file, index) => {
                return (
                    <div key={index} className="library__file">
                        <a href={``} download={file}>
                            {file}
                        </a>
                        <span
                            onClick={e => console.log(e)}
                            className="glyphicon glyphicon-play"
                        />
                    </div>
                );
            })}
        </>
    );
};

export default Library;

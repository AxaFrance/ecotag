import React, {useEffect, useState} from "react";
import "@axa-fr/react-toolkit-core/dist/assets/fonts/icons/af-icons.css";

const Library = () => {
    
    const [state, setState] = useState({
        time: new Date().toLocaleString(),
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
        setState({
            ...state,
            date: new Date().toLocaleString()
        });
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

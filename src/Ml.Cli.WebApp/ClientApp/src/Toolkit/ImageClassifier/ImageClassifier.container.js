import React, {useEffect, useState} from "react";
import Toolbar from "./Toolbar.container";
import '../Toolbar/Toolbar.scss';
import ImageClassifier from "./ImageClassifier";

const ImageClassifierContainer = ({url, labels, onSubmit, expectedOutput}) => {
    const [state, setState] = useState({
        labels,
        url,
        rotate: 0,
        widthImage: 80,
        inlineMode: false,
        marginRotate: 0,
        initialRotate: true,
        userInput: {},
    });

    useEffect(() => {
        const userInput = {};
        for (const [key, value] of Object.entries(labels)) {
            userInput[key] = value;
        }
        setState({ ...state, userInput });
    }, [url]);
    
    return (
        <>
            <ImageClassifier onSubmit={onSubmit} url={url} labels={labels} state={state} expectedOutput={expectedOutput}/>
            <Toolbar state={state} setState={setState}/>
        </>
    )
};

export default React.memo(ImageClassifierContainer);
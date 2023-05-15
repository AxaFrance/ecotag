import React, {useEffect, useRef, useState} from "react";
import Toolbar from "./Toolbar.container";
import '../Toolbar/Toolbar.scss';
import ImageClassifier from "./ImageClassifier";

const ImageClassifierContainer = ({url, labels, onSubmit, expectedOutput}) => {
    const [state, setState] = useState({
        labels,
        url,
        rotate: 0,
        widthImage: 100,
        inlineMode: false,
        marginRotate: 0,
        initialRotate: true,
        userInput: {},
    });
    const containerRef = useRef(null);

    useEffect(() => {
        const userInput = {};
        for (const [key, value] of Object.entries(labels)) {
            userInput[key] = value;
        }
        setState({...state, userInput});
        if (containerRef?.current?.scrollIntoView) {
            containerRef.current.scrollIntoView({
                block: 'start',
                behavior: 'smooth',
            });
        }
    }, [url]);

    return (
        <div ref={containerRef}>
            <ImageClassifier onSubmit={onSubmit} url={url} labels={labels} state={state}
                             expectedOutput={expectedOutput}/>
            <Toolbar state={state} setState={setState}/>
        </div>
    );
};

export default React.memo(ImageClassifierContainer);
import React, {useEffect, useRef, useState} from 'react';
import Ocr from './Ocr';
import Toolbar from './Toolbar.container';
import './Ocr.scss';
import './Ocr.container.scss';
import '@axa-fr/react-toolkit-core/dist/assets/fonts/icons/af-icons.css';

const OcrContainer = ({labels, expectedLabels, url, onSubmit}) => {
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
    const containerRef = useRef(null);

    useEffect(() => {
        const userInput = {};
        if (expectedLabels) {
            if (Array.isArray(labels)) {
                labels.map(label => {
                    userInput[label.name] = expectedLabels[label.name] || '';
                });
            } else {
                for (const [key, value] of Object.entries(labels)) {
                    userInput[key] = value;
                }
            }
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
        <div className="ocr-container-adapter" ref={containerRef}>
            <Ocr state={state} setState={setState} url={url}/>
            <Toolbar onSubmit={onSubmit} state={state} setState={setState}/>
        </div>
    );
};

export default React.memo(OcrContainer);

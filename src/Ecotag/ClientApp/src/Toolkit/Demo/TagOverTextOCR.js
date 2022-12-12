import Tesseract from "tesseract.js";
import cuid from "cuid";
import React, {useEffect, useState} from "react";
import TagOverTextContainer from "../TagOverText/TagOverText.container";
import './TagOverTextOCR.scss';
import {Loader, LoaderModes} from "@axa-fr/react-toolkit-all";

const TagOverTextOCR = ({url}) => {

    const [state, setState] = useState({
        loaderMode: LoaderModes.get,
        boundingBoxes: null,
        result: []
    });

    useEffect(() => {
        applyTesseract()
    }, []);

    const applyTesseract = () => {
        Tesseract.recognize(
            url,
            'fra',
            {logger: m => console.log(m)}
        ).then(tesseractResult => {
            console.log(tesseractResult);
            const {data: {text, lines}} = tesseractResult;
            let expectedOutputs = [];
            let currentWordIndex = 0;
            lines.forEach((line, indexLine) => {
                line.words.forEach((word) => {
                    let expectedOutput = {
                        "level": 5,
                        "page_num": 1,
                        "block_num": indexLine,
                        "par_num": 1,
                        "line_num": indexLine,
                        "word_num": currentWordIndex,
                        "left": word.bbox.x0,
                        "top": word.bbox.y0,
                        "width": word.bbox.x1 - word.bbox.x0,
                        "height": word.bbox.y1 - word.bbox.y0,
                        "conf": word.confidence,
                        "text": word.text,
                        "id": cuid()
                    };

                    if (word.text.length > 3) {
                        currentWordIndex++;
                        expectedOutputs.push(expectedOutput);
                    }
                })
            })
            let boundingBoxes = {"boundingBoxes": expectedOutputs};
            console.log(expectedOutputs);
            console.log(text);
            setState({...state, boundingBoxes, loaderMode: LoaderModes.none});
        });
    }

    return (
        <Loader mode={state.loaderMode} text={"Applying OCR..."}>
            {state.loaderMode === LoaderModes.get &&
                <div className="tag-over-text-ocr__ocr-application"/>
            }
            {state.boundingBoxes ? (
                <>
                    {state.result.map((boundingBox, index) => {
                        return (<p className="tag-over-text-ocr__result" key={index}>Bounding
                            box {index} : {JSON.stringify(boundingBox)}</p>);
                    })}
                    <div className="tag-over-text-ocr__container">
                        <TagOverTextContainer url={url} expectedOutput={state.boundingBoxes.boundingBoxes}
                                              onSubmit={(e) => setState({...state, result: e.labels.boundingBoxes})}/>
                    </div>
                </>
            ) : (
                <></>
            )}
        </Loader>
    )

};

export default TagOverTextOCR;
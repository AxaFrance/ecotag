import React, {useState} from 'react';
import { storiesOf } from '@storybook/react';
import useScript from '../Script/useScript.js';
import TagOverTextContainer from './TagOverTextContainer';

import {
    playAlgoWithTemplateAndApplyTesseractAsync
} from "./template";
import {SelectBase} from "@axa-fr/react-toolkit-form-input-select";
import File from "@axa-fr/react-toolkit-form-input-file/dist/File";
import {Loader, LoaderModes} from "@axa-fr/react-toolkit-all";

const french_identity_card_recto = require("./french_id_card_recto.json");
const french_identity_card_verso = require('./french_id_card_verso.json');
const french_passport = require('./french_passport.json');
const french_new_driver_license_recto = require("./french_license_recto.json");
const french_new_driver_license_verso = require("./french_license_verso.json");

const optionsSelect = [
    {value: 0, label: "French identity card recto"},
    {value: 1, label: "French identity card verso"},
    {value: 2, label: "French Passport"},
    {value: 3, label: "French new license recto"},
    {value: 4, label: "French new license verso"}
];

function TagOverTextGenerator( {templates =[]}){

    const [loaded, error] = useScript(
        `https://docs.opencv.org/4.5.2/opencv.js`
    );

    const [state, setState] = useState({
        files: [],
        url : null,
        croppedUrl : null,
        confidenceRate: 0,
        boundingBoxes: null,
        expectedOutput:[],
        outputInfo: null,
        isGray:false,
        filename:null,
        loaderMode: LoaderModes.none,
        templateIndex: 0
    });

    if(!loaded){
        return (<p>Loading</p>);
    }

    const onChange = value => {
        const file = value.values[0].file;
        let index = 0;
        if(templates.length > index) {
            setState({...state, loaderMode: LoaderModes.get, croppedUrl: null});
            playAlgoWithTemplateAndApplyTesseractAsync(templates[state.templateIndex], setState, state, file);
        }
    };

    return (
        <Loader mode={state.loaderMode} text={"Your browser is working"}>
            <form className="af-form ri__form-container" name="myform">
                <div className="ri__form-content">
                    <div className="ri__form">
                        <SelectBase
                            id="select_type"
                            name="SelectType"
                            value={state.templateIndex}
                            options={optionsSelect}
                            onChange={e => {
                                setState({...state, templateIndex: e.value});
                            }}
                        />
                        <File
                            id="file"
                            name="RI"
                            accept={'image/jpeg, image/png, image/tiff, image/tif, application/*'}
                            onChange={onChange}
                            multiple={false}
                            isVisible={true}
                            readOnly={false}
                            disabled={false}
                            label="Parcourir"
                            icon="open"
                        />
                        {state.url &&
                        <TagOverTextContainer  url={state.croppedContoursBase64[0]} expectedOutput={state.boundingBoxes.boundingBoxes} confidence={state.confidenceRate}/>
                        }
                    </div>
                </div>
            </form>
        </Loader>);
}

storiesOf('Demo', module).add('Demo TagOverText', () => (
    <TagOverTextGenerator templates={[
        {imgDescription: french_identity_card_recto, goodMatchSizeThreshold:5},
        {imgDescription: french_identity_card_verso, goodMatchSizeThreshold: 5},
        {imgDescription: french_passport, goodMatchSizeThreshold: 5},
        {imgDescription: french_new_driver_license_recto, goodMatchSizeThreshold: 5},
        {imgDescription: french_new_driver_license_verso, goodMatchSizeThreshold: 5}
    ]} />
));

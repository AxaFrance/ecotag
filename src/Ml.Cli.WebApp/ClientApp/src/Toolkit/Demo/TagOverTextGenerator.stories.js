import React, {useState} from 'react';
import { storiesOf } from '@storybook/react';
import {SelectBase} from "@axa-fr/react-toolkit-form-input-select";
import File from "@axa-fr/react-toolkit-form-input-file/dist/File";
import {Loader, LoaderModes} from "@axa-fr/react-toolkit-all";
import {
    getExpectedOutputWithCurrentTemplateAsync,
    playAlgoNoTemplateAsync,
} from "./template";
import TagOverTextOCR from "./TagOverTextOCR";
import useScript from "../Script/useScript";
import './TagOverTextGenerator.scss';

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
    {value: 4, label: "French new license verso"},
    {value: 5, label: "No template"}
];

function TagOverTextGenerator( {templates =[]}){

    const [loaded, error] = useScript(
        `https://docs.opencv.org/4.5.5/opencv.js`
    );
    
    const [state, setState] = useState({
        files: [],
        url : null,
        croppedContoursBase64: [null],
        croppedUrl : null,
        expectedOutput:[],
        filename:null,
        loaderMode: LoaderModes.none,
        templateIndex: 0,
        errorMessage: "",
        noTemplateImage: ""
    });

    const onChange = async value => {
        const file = value.values[0].file;
        if(state.templateIndex < 5){
            const currentTemplate = templates[state.templateIndex];
            let index = 0;
            if(templates.length > index) {
                setState({...state, noTemplateImage: "", loaderMode: LoaderModes.get, croppedContoursBase64: [null]});
                await getExpectedOutputWithCurrentTemplateAsync(currentTemplate, setState, state, file);
            }
        }
        else{
            const files = await playAlgoNoTemplateAsync(file);
            setState({...state, noTemplateImage: files[0], croppedContoursBase64: [null]});
        }
    };

    if(!loaded){
        return (<p>Loading</p>);
    }

    return (
        <Loader mode={state.loaderMode} text={"Cropping template"}>
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
                            accept={'image/jpeg, image/png, image/tiff, image/tif, application/pdf'}
                            onChange={onChange}
                            multiple={false}
                            isVisible={true}
                            readOnly={false}
                            placeholder={"Drag and drop a pdf or tiff or png or jpg file"}
                            disabled={false}
                            label="Browse"
                            icon="open"
                        />
                        {state.errorMessage ? (
                            <p className="tag-over-text-generator__error">{state.errorMessage}</p>
                        ) : (
                            <>
                                {state.croppedContoursBase64[0] &&
                                    <TagOverTextOCR
                                        url={state.croppedContoursBase64[0]}
                                        loaderState={state}
                                        setLoaderState={setState}
                                    />
                                }
                                {state.noTemplateImage &&
                                    <img src={state.noTemplateImage} alt="No Template files"/>
                                }
                            </>
                        )
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

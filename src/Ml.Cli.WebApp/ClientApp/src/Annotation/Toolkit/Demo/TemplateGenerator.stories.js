import Loader, {LoaderModes} from "@axa-fr/react-toolkit-loader";
import React, {useState} from "react";
import {storiesOf} from "@storybook/react";
import {File} from "@axa-fr/react-toolkit-form-input-file";
import {toBase64Async} from "./template";
import {imageResize, loadImageAsync} from "../Opencv/image";
import {detectAndComputeSerializable} from "../Opencv/match";
import useScript from "../Script/useScript";
import './TemplateGenerator.scss';

const TemplateGenerator = () => {

    const [loaded, error] = useScript(
        `https://docs.opencv.org/4.5.2/opencv.js`
    );
    
    const [state, setState] = useState({
        loaderMode: LoaderModes.none,
        jsonContent: ""
    });

    if(!loaded){
        return (<p>Loading</p>);
    }

    const onChange = async value => {
        const file = value.values[0].file;
        const cv = window.cv;
        const convertedfile = await toBase64Async(file);
        const imgVersoCvTemplate = await loadImageAsync(cv)(convertedfile);
        const imgVersoCvTemplateResized = imageResize(cv)(imgVersoCvTemplate, 600).image;
        const resizedImg = detectAndComputeSerializable(cv)( imgVersoCvTemplateResized);
        const jsonValue = JSON.stringify(resizedImg);
        setState({...state, jsonContent: jsonValue});
    }
    
    return(
        <Loader mode={state.loaderMode} text={"Your browser is working"}>
            <form className="af-form ri__form-container" name="myform">
                <h1>Template Generator</h1>
                <File
                    id="file"
                    name="RI"
                    accept={'image/jpg, image/jpeg, image/png'}
                    onChange={onChange}
                    multiple={false}
                    isVisible={true}
                    readOnly={false}
                    disabled={false}
                    placeholder={"Drag and drop a png, jpeg or jpg file"}
                    label="Browse"
                    icon="open"
                />
                <div className="generator-content">{state.jsonContent}</div>
            </form>
        </Loader>
    )
    
};

storiesOf('Demo', module).add('Demo Template Generator', () => (
    <TemplateGenerator/>
));
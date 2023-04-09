import Loader, {LoaderModes} from "@axa-fr/react-toolkit-loader";
import React, {useCallback, useRef, useState} from "react";
import {storiesOf} from "@storybook/react";
import {File} from "@axa-fr/react-toolkit-form-input-file";
import {playAlgoWithCurrentTemplateAsync, toBase64Async} from "./template";
import {imageResize, loadImageAsync} from "../Opencv/image";
import {detectAndComputeSerializable} from "../Opencv/match";
import useScript from "../Script/useScript";
import './TemplateGenerator.scss';

import Webcam from "react-webcam";

function WebcamImage({captureCallBack, templateJson}) {
  const [img, setImg] = useState(null);
  const webcamRef = useRef(null);

  const videoConstraints = {
    width: 420,
    height: 420,
    facingMode: "user",
  };

  const capture = useCallback(() => {
    const imageSrc = webcamRef.current.getScreenshot();
    setImg(imageSrc);
    captureCallBack(imageSrc, templateJson);
  }, [webcamRef, templateJson]);

  return (
    <div className="Container">
      {img === null ? (
        <>
          <Webcam
            audio={false}
            mirrored={false}
            height={400}
            width={400}
            ref={webcamRef}
            screenshotFormat="image/jpeg"
            videoConstraints={videoConstraints}
          />
          <button onClick={capture}>Capture photo</button>
        </>
      ) : (
        <>
          <button onClick={() => setImg(null)}>Retake</button>
          <img src={img} alt="screenshot" />
        </>
      )}
    </div>
  );
}

const TemplateGenerator = () => {

    const [loaded, error] = useScript(
        `https://docs.opencv.org/4.7.0/opencv.js`
    );

    const [state, setState] = useState({
        loaderMode: LoaderModes.none,
        templateImage: "",
        jsonContent: "",
        croppedContoursBase64: [null],
        errorMessage: ""
    });
    
    if (!loaded) {
        return (<p>Loading</p>);
    }

    const onChange = async value => {
        const file = value.values[0].file;
        const cv = window.cv;
        const convertedfile = await toBase64Async(file);  
        const imgVersoCvTemplate = await loadImageAsync(cv)(convertedfile);
        const imgVersoCvTemplateResized = imageResize(cv)(imgVersoCvTemplate, 600).image;
        const resizedImg = detectAndComputeSerializable(cv)(imgVersoCvTemplateResized);
        const jsonValue = JSON.stringify(resizedImg);
        setState({...state, jsonContent: jsonValue, templateImage: convertedfile});
    }

    const capture = (value, templateJson ) => {
        const file = {fileBase64: value, name: "screen.base64" };
        const template = {imgDescription: JSON.parse(templateJson), goodMatchSizeThreshold: 5};
        setState({...state, loaderMode: LoaderModes.get, croppedContoursBase64: [null]});
        playAlgoWithCurrentTemplateAsync(template, setState, state, file);
    }

    return (
        <Loader mode={state.loaderMode} text={"Your browser is working"}>
            <form className="af-form ri__form-container" name="myform">
                <h1>Template Generator</h1>
                <File
                    id="file"
                    name="TemplateGenerator"
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
                {state.templateImage &&
                    <img src={state.templateImage} alt="template image"/>
                }
                <div className="template-generator__content">{state.jsonContent}</div>
                <table>
                    <tbody>
                      <tr>
                        <td>Webcam</td>
                        <td>Image Found</td>
                      </tr>
                      <tr>
                        <td><WebcamImage captureCallBack={capture} templateJson={state.jsonContent} /></td>
                        <td>  {state.errorMessage ? (
                            <p className="template-generator__error">{state.errorMessage}</p>
                        ) : (
                            <>
                                {state.croppedContoursBase64 && state.croppedContoursBase64[0] &&
                                    <><img src={state.croppedContoursBase64[0]} alt="image found"/>
                                    </>
                                }
                            </>
                        )
                        }</td>
                      </tr>

                      
                      </tbody>
                </table>
                
              
            </form>
        </Loader>
    )

};

storiesOf('Demo', module).add('Demo Template Generator Video', () => (
    <TemplateGenerator/>
));
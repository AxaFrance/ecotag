import Loader, {LoaderModes} from "@axa-fr/react-toolkit-loader";
import React, {useEffect, useRef, useState} from "react";
import {storiesOf} from "@storybook/react";
import {File} from "@axa-fr/react-toolkit-form-input-file";
import {playAlgoWithCurrentTemplateAsync, toBase64Async} from "./template";
import {imageResize, loadImageAsync} from "../Opencv/image";
import {detectAndComputeSerializable} from "../Opencv/match";
import useScript from "../Script/useScript";
import './TemplateGenerator.scss';

const TemplateGenerator = () => {

    const [loaded, error] = useScript(
        `https://docs.opencv.org/4.7.0/opencv.js`
    );
    const videoRef = useRef(null);
    const canevasRef = useRef(null);
    useEffect(() => {
        if(videoRef && videoRef.current) {
            const cv = window.cv;
            let video = videoRef.current; // video is the id of video tag
            navigator.mediaDevices.getUserMedia({video: true, audio: false})
                .then(function (stream) {
                    video.srcObject = stream;
                    video.play();

                    let canvasFrame = canevasRef.current;
                    let context = canvasFrame.getContext("2d");
                    let src = new cv.Mat(height, width, cv.CV_8UC4);
                    let dst = new cv.Mat(height, width, cv.CV_8UC1);

                    const FPS = 30;
                    function processVideo() {
                        let begin = Date.now();
                        context.drawImage(video, 0, 0, width, height);
                        src.data.set(context.getImageData(0, 0, width, height).data);
                        cv.cvtColor(src, dst, cv.COLOR_RGBA2GRAY);
                        cv.imshow("canvasOutput", dst); // canvasOutput is the id of another <canvas>;
                        // schedule next one.
                        let delay = 1000/FPS - (Date.now() - begin);
                        setTimeout(processVideo, delay);
                    }
// schedule first one.
                    setTimeout(processVideo, 0);
                })
                .catch(function (err) {
                    console.log("An error occurred! " + err);
                });
        }
    }, [videoRef]);

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

    const onFileTest = value => {
        const file = value.values[0].file;
        const template = {imgDescription: JSON.parse(state.jsonContent), goodMatchSizeThreshold: 5};
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
                    <>
                        <table cellPadding="0" cellSpacing="0" width="0" border="0">
                            <tbody>
                            <tr>
                                <td>
                                    <video ref={videoRef} id="videoInput" width="320" height="240"></video>
                                </td>
                                <td>
                                    <canvas ref={canevasRef} id="canvasOutput" width="320" height="240"></canvas>
                                </td>
                                <td></td>
                                <td></td>
                            </tr>
                            <tr>
                                <td>
                                    <div className="caption">videoInput</div>
                                </td>
                                <td>
                                    <div className="caption">canvasOutput</div>
                                </td>
                                <td></td>
                                <td></td>
                            </tr>
                            </tbody>
                        </table>
                    </>
            </form>
        </Loader>
    )

};

storiesOf('Demo', module).add('Demo Template Generator Video', () => (
    <TemplateGenerator/>
));
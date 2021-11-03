import React, {useState} from 'react';
import { storiesOf } from '@storybook/react';
import { File } from '@axa-fr/react-toolkit-form-input-file';
import useScript from '../Script/useScript.js';
import Loader, { LoaderModes } from '@axa-fr/react-toolkit-loader';

import { playAlgoAsync } from "./template";
import {SelectBase} from "@axa-fr/react-toolkit-form-input-select";

const french_identity_card_recto = require("./french_id_card_recto.json");
const french_identity_card_verso = require('./french_id_card_verso.json');
const french_passport = require('./french_passport.json');
const french_new_driver_license_recto = require("./french_license_recto.json");
const french_new_driver_license_verso = require("./french_license_verso.json")

const optionsSelect = [
    {value: 0, label: "French identity card recto"},
    {value: 1, label: "French identity card verso"},
    {value: 2, label: "French Passport"},
    {value: 3, label: "French new license recto"},
    {value: 4, label: "French new license verso"}
];

function Demo( {templates =[]}){

  const [loaded, error] = useScript(
      `https://docs.opencv.org/4.5.2/opencv.js`
  );

  const [state, setState] = useState({
    files: [],
    loaderMode: LoaderModes.none,
    outputInfo: null,
    isGray:false,
    filename:null,
    croppedContoursBase64:null,
    templateIndex: 0
  });
 
  if(!loaded){
    return (<p>Loading</p>);
  }
  
  const playAlgoRecursiveAsync = (templates, index, setState, state, file) => {
    let {imgDescription, goodMatchSizeThreshold} = templates[index];
    playAlgoAsync(window.cv)(file, imgDescription, goodMatchSizeThreshold).then(result => {
      if (result) {
        index++;
        if(result.data.expectedOutput.length <= 0 && templates.length > index){
          playAlgoRecursiveAsync(templates, index, setState, state, file);
        } else{
          setState({...state, ...result.data, files: result.files, loaderMode: LoaderModes.none, filename: result.filename });
        }
      }
    });
  }
  
  const playAlgoWithCurrentTemplateAsync = (template, setState, state, file) => {
      playAlgoAsync(window.cv)(file, template.imgDescription, template.goodMatchSizeThreshold).then(result => {
          if(result){
              setState({...state, ...result.data, files: result.files, loaderMode: LoaderModes.none, filename: result.filename});
          }
      })
  }
    
  const onChange = value => {
    if(templates.length > 0) {
        setState({...state,
          loaderMode: LoaderModes.get,
          outputInfo: null,
          isGray:false,
          filename:null,
          croppedContoursBase64:null,
          files:[]
        });
        const file = value.values[0].file;
        playAlgoWithCurrentTemplateAsync(templates[state.templateIndex], setState, state, file);
        //playAlgoRecursiveAsync(templates, 0, setState, state, file)
    }
  };
  
  return (
      <Loader mode={state.loaderMode} text={"Your browser is working"}><form className="af-form ri__form-container" name="myform">
        <h1>Find a document</h1>
      <p>
          This component runs only in the browser.
          <br/>
          No files are saved anywhere, it stays locally in your browser only.
          <br/>
          This component checks the quality of your document entering information systems. This brings several advantages :
          <br/>
          <ul>
              <li>This makes it possible to “quickly” warn the user that his document is not of good quality and therefore not very readable.</li>
              <li>This increases the quality of the data received in the systems.</li>
              <li>The processing of the requested documents needs less calculation and production infrastructure costs are reduced (part of the calculation is carried out in the browser client).</li>
          </ul>
          This component is currently experimental.
      </p>
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
        disabled={false}
        placeholder={"Drag and drop a pdf or tiff or png or jpg file"}
        label="Browse"
        icon="open"
      />
      {state.files.length > 0 && state.croppedContoursBase64 == null ? <><h2>No image found</h2></>: null}
      {state.croppedContoursBase64 != null ? <><h2>Image found</h2>
        <p>Image in {state.isGray ? "grey": "color"}</p>
        <p>Document quality/detection: {state.confidenceRate}%</p>
        <img src={state.croppedContoursBase64[0]}  alt="image found"/>
        <p>{state.filename}</p>
        <p>{state.outputInfo != null ? JSON.stringify(state.outputInfo) : null}</p>
        </> : null}
      
      {state.files.length > 0 ? <><h2>Original image(s)</h2>
          {state.files.map((file, index) => <img key={index} src={file}  alt="pdf page" style={{"max-width": "100%"}} />)} </>: null}
    </div>
  </div>
</form>  
      </Loader>);
}

storiesOf('Demo', module).add('Demo recto cni', () => (
  <Demo templates={[
      {imgDescription: french_identity_card_recto, goodMatchSizeThreshold:5},
      {imgDescription: french_identity_card_verso, goodMatchSizeThreshold: 5},
      {imgDescription: french_passport, goodMatchSizeThreshold: 5},
      {imgDescription: french_new_driver_license_recto, goodMatchSizeThreshold: 5},
      {imgDescription: french_new_driver_license_verso, goodMatchSizeThreshold: 5}
  ]} />
));

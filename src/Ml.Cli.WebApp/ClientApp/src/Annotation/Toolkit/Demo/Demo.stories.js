import React, {useState} from 'react';
import { storiesOf } from '@storybook/react';
import { File } from '@axa-fr/react-toolkit-form-input-file';
import useScript from '../Script/useScript.js';
import Loader, { LoaderModes } from '@axa-fr/react-toolkit-loader';

import { playAlgoAsync } from "./cni";
import {SelectBase} from "@axa-fr/react-toolkit-form-input-select";

const cni = require("./cni.json");

const optionsSelect = [
    {value: 0, label: "Carte identité verso"},
    {value: 1, label: "Passeport"},
    {value: 2, label: "Nouveau permis recto"},
    {value: 3, label: "Nouveau permis verso"}
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
    return (<p>Chargement</p>);
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
        <h1>French identity card</h1>
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
  <Demo templates={[{imgDescription:cni, goodMatchSizeThreshold:4}]} />
));

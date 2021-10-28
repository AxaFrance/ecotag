import React, {useState} from 'react';
import { storiesOf } from '@storybook/react';
import { File } from '@axa-fr/react-toolkit-form-input-file';
import convertPdfToImagesAsync from './pdf'
import Loader, { LoaderModes } from '@axa-fr/react-toolkit-loader';

function Demo(){
  
  const [state, setState] = useState({
    files: [],
    loaderMode: LoaderModes.none,
  });


  const onChange = value => {
    
    if(value.values.length <= 0){
      return;
    }
    
    setState({
      ...state,
      loaderMode: LoaderModes.get,
    });
    convertPdfToImagesAsync()(value.values[0].file).then(files => {
        setState({
          ...state,
          files: files,
          loaderMode: LoaderModes.none,
        });
      });
  };

  return (<Loader mode={state.loaderMode} text={"Your browser is extracting the pdf to png images"}>
      <form className="af-form ri__form-container" name="myform">
        <div className="ri__form-content">
          <div className="ri__form">
            <File
              id="file"
              name="file"
              accept={'application/pdf'}
              onChange={onChange}
              multiple={false}
              isVisible={true}
              readOnly={false}
              disabled={false}
              placeholder={"Drag and drop a pdf file"}
              label="Browse"
              icon="open"
            />
            {state.files.map((file, index) => <img key={index} src={file}  alt="pdf page" style={{"max-width": "100%"}} />)}
          </div>
        </div>
      </form>
  </Loader>);
}

storiesOf('Pdf', module).add('Pdf', () => (
  <Demo />
));

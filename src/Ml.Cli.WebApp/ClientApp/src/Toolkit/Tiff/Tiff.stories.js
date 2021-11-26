import React, {useState} from 'react';
import { storiesOf } from '@storybook/react';
import { File } from '@axa-fr/react-toolkit-form-input-file';
import convertTiffToImagesAsync from './tiff';
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
    convertTiffToImagesAsync()(value.values[0].file).then(files => {
      setState({
        ...state,
        files: files,
      });
    })
  };

  return (<Loader mode={state.loaderMode} text={"Your browser is converting the tiff to png images"}>
            <form className="af-form ri__form-container" name="myform">
              <div className="ri__form-content">
                <div className="ri__form">
                  <File
                      id="file"
                      name="file"
                      accept={'image/tiff'}
                      onChange={onChange}
                      multiple={false}
                      isVisible={true}
                      readOnly={false}
                      disabled={false}
                      placeholder={"Drag and drop a tiff file"}
                      label="Browse"
                      icon="open"
                  />
                  {state.files.map((file, index) => <img key={index} src={file}  alt="tiff image" style={{"max-width": "100%"}}/>)}
                </div>
              </div>
            </form>
      </Loader>);
}

storiesOf('Tiff', module).add('Tiff', () => (
  <Demo />
));

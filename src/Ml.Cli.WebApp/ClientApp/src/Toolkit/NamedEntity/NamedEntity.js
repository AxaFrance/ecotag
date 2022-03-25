import React, {useEffect, useState} from 'react';
import Label from './LabelV2Core';
import { setLabelColor } from './labelColor.js';
import './NamedEntity.scss';
import TextAnnotation from './TextAnnotation';

const initAsync = async (url, setState, state) => {
  const response = await fetch(url);
  const blob = await response.blob();
  const text = await blob.text();
  setState({...state, text})
}

const NamedEntity = ({ text=null, labels, onSubmit, placeholder, url }) => {
  const [state, setState] = useState({
    label: setLabelColor(labels[0]),
    value: [],
    text: null,
  });

  useEffect(() => {
    initAsync(url, setState, state);
  }, [url]);

  

  const selectLabel = label => {
    setState({ ...state, label });
  };

  const handleChange = value => {
    setState({ ...state, value });
  };

  const submitAnnotation = () => {
    onSubmit(state.value);
    setState({ ...state, value: [] });
  };

  return (
    <div>
      <div className="annotationContainer">
        <div className="sticky">
          <Label labels={labels} selectLabel={selectLabel} selectedLabel={state.label} />
        </div>
        <div>Selected tag : {state.label.name}</div>
        <div className="tokenAnnotation-container">
          <TextAnnotation
            className="tokenAnnotator-component"
            text={text || state.text}
            value={state.value}
            onChange={handleChange}
            getSpan={span => ({
              ...span,
              label: state.label,
            })}
          />
        </div>
        <div className="annotationActionContainer">
          <button className="buttonAnnotationAction" onClick={submitAnnotation}>
            {placeholder}
          </button>
        </div>
        <pre>{JSON.stringify(state.value, null, 2)}</pre>
      </div>
    </div>
  );
};

export default NamedEntity;

import React, { useState } from 'react';
import Label from './LabelV2Core';
import { setLabelColor } from './labelColor.js';
import './NamedEntity.scss';
import TextAnnotation from './TextAnnotation';

const NamedEntity = ({ text, labels, annotationAction }) => {
  const [state, setState] = useState({
    label: setLabelColor(labels[0]),
    value: [],
  });

  const selectLabel = label => {
    setState({ ...state, label });
  };

  const handleChange = value => {
    setState({ ...state, value });
  };

  const submitAnnotation = label => {
    annotationAction(label);
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
            text={text}
            value={state.value}
            onChange={handleChange}
            getSpan={span => ({
              ...span,
              label: state.label,
            })}
          />
        </div>
        <div className="annotationActionContainer">
          <button className="buttonAnnotationAction" onClick={() => submitAnnotation(state.value)}>
            Soumettre l&apos;annotation
          </button>
        </div>
        <pre>{JSON.stringify(state.value, null, 2)}</pre>
      </div>
    </div>
  );
};

export default NamedEntity;

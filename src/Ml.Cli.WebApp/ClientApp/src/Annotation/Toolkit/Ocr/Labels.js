import React from 'react';

import './Labels.scss';

const Labels = ({ labels, state, setState }) => {
  const size = width => {
    return state.inlineMode && state.initialRotate ? 100 - width : 100;
  };

  const saveLabelValue = (e, label) => {
    setState({
      ...state,
      userInput: { ...state.userInput, [label.name]: e.target.value },
    });
  };

  return (
    <div className="orc-labels__container" style={{ width: `${size(state.widthImage)}%` }}>
      <form className="ocr-labels__form">
        {labels.map((label, index) => {
          const userInputValue = state.userInput[label.name];
          const value = userInputValue ? userInputValue : '';
          return (
            <div key={index}>
              <p className="ocr-labels__label">{label.name}</p>
              <textarea
                name={label.name}
                value={value}
                onChange={e => saveLabelValue(e, label)}
                className="ocr-labels__textarea"></textarea>
            </div>
          );
        })}
      </form>
    </div>
  );
};

export default React.memo(Labels);

import React from 'react';
import { GlobalHotKeys } from 'react-hotkeys';

import './Labels.scss';

const Labels = ({ setState, state, labels }) => {
  const selectLabel = label => {
    setState({ ...state, currentLabelId: label.id });
  };

  const switchLabelOnTab = (meaning, e) => {
    e.preventDefault();
    const labelsNumber = labels.length;
    let newCurrentLabelId;
    let currentLabelId = state.currentLabelId;
    const findIndex = label => label.id === currentLabelId;
    const labelIndex = labels.findIndex(findIndex);
    if (meaning === 'down') {
      newCurrentLabelId = labelIndex + 1 < labelsNumber ? labelIndex + 1 : 0;
    } else {
      newCurrentLabelId = labelIndex - 1 < 0 ? labelsNumber - 1 : labelIndex - 1;
    }
    setState({ ...state, currentLabelId: labels[newCurrentLabelId].id });
  };

  const shortcuts = [
    'alt+&',
    'alt+é',
    'alt+"',
    "alt+'",
    'alt+(',
    'alt+-',
    'alt+è',
    'alt+_',
    'alt+ç',
    'alt+à',
    'alt+a',
    'alt+z',
    'alt+e',
    'alt+r',
    'alt+t',
    'alt+y',
    'alt+u',
    'alt+i',
    'alt+o',
    'alt+p',
  ];
  const keyMap = {
    switchDown: 'tab',
    switchUp: 'shift+tab',
  };
  const handlers = {
    switchDown: e => switchLabelOnTab('down', e),
    switchUp: e => switchLabelOnTab('up', e),
  };

  for (let i = 0; i < labels.length; i++) {
    keyMap[`selectLabel${i + 1}`] = shortcuts[i];
    handlers[`selectLabel${i + 1}`] = () => selectLabel(labels[i].id);
  }

  const calculNumberShapeByLabel = (shapes, labelId) => shapes.filter(shape => shape.labelId === labelId).length;

  return (
    <GlobalHotKeys allowChanges={true} keyMap={keyMap} handlers={handlers}>
      <div className="labels-container">
        <h2 className="labels-title">Labels</h2>
        {labels.map((label, index) => {
          return (
            <button
              key={index}
              title={index + 1 <= shortcuts.length ? `Raccourci : alt + ${index + 1}` : 'Pas de raccourci'}
              className={state.currentLabelId === index.toString() ? 'labels-button-current' : 'labels-button'}
              onClick={() => selectLabel(label)}>
              <div className="labels-color" style={{ backgroundColor: label.color }} />
              <span>{label.label}</span>
              <span className="labels__counter">{calculNumberShapeByLabel(state.shapes, label.id)}</span>
            </button>
          );
        })}
      </div>
    </GlobalHotKeys>
  );
};

export default React.memo(Labels);

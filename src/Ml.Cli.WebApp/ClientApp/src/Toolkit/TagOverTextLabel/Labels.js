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
    let newCurrentlabels;
    const currentLabelId = state.currentLabelId;
    const findIndex = label => label.id === currentLabelId;
    const labelIndex = labels.findIndex(findIndex);
    if (meaning === 'down') {
      newCurrentlabels = labelIndex + 1 < labelsNumber ? labelIndex + 1 : 0;
    } else {
      newCurrentlabels = labelIndex - 1 === -1 ? labelsNumber - 1 : labelIndex - 1;
    }
    setState({ ...state, currentLabelId: labels[newCurrentlabels].id });
  };

  const keyMap = {
    switchDown: 'tab',
    switchUp: 'shift+tab',
  };
  const handlers = {
    switchDown: e => switchLabelOnTab('down', e),
    switchUp: e => switchLabelOnTab('up', e),
  };

  const countLabel = label => {
    const shapes = state.shapes;
    const count = shapes.filter(shape => shape.labelGroupId === label.id);
    return count.length;
  };

  return (
    <GlobalHotKeys allowChanges={true} keyMap={keyMap} handlers={handlers}>
      <div className="totl-labels__container">
        <h2 className="totl-labels__title">Labels</h2>
        {labels.map((label, index) => {
          return (
            <button
              key={index}
              title="Pas de raccourci"
              className={
                state.currentLabelId === index.toString() ? 'totl-labels__button-current' : 'totl-labels__labels-button'
              }
              onClick={() => selectLabel(label)}>
              <div className="totl-labels__color" style={{ backgroundColor: label.color }} />
              <span>{label.label}</span>
              <span className="totl-labels__counter">{countLabel(label)}</span>
            </button>
          );
        })}
      </div>
    </GlobalHotKeys>
  );
};

export default React.memo(Labels);

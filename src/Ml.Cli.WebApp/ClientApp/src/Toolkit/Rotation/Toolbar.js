import React from 'react';
import { GlobalHotKeys, configure } from 'react-hotkeys';
import Toolbar, { ToolbarButtonContainer, ToolbarSwitchButton, ToolbarProgressButton } from '../Toolbar';

import './Toolbar.scss';
import './ComponentsModifier.scss';

configure({ ignoreRepeatedEventsWhenKeyHeldDown: false });

const getFileExtension = filename => {
  if (!filename) return '';
  return filename.split('.').pop().split('?')[0];
};

const getImageInfo = imageDimensions => {
  const imageWidth = imageDimensions.width;
  const imageHeight = imageDimensions.height;
  return {
    imageWidth,
    imageHeight,
  };
};

const ToolbarContainer = ({ url, state, setState, onSubmit, expectedAngle }) => {
  const { imageWidth, imageHeight } = getImageInfo(state.imageDimensions);
  const isSubmitDisabled = imageHeight === 0;

  const onSubmitOverride = () => {
    if (isSubmitDisabled) {
      return;
    }
    const data = {
      image_anomaly: state.imageAnomaly,
      width: imageWidth,
      height: imageHeight,
      type: getFileExtension(url),
      labels: {
        angle: parseInt(state.rotate, 10),
      },
    };
    onSubmit(data);
  };

  const keyMap = {
    submit: 'ctrl+spacebar',
    moveShapeLeft: 'ArrowLeft',
    moveShapeRight: 'ArrowRight',
  };

  const handlers = {
    submit: onSubmitOverride,
    moveShapeLeft: () => {
      if (state.rotate < 180) {
        setState({
          ...state,
          rotate: (parseInt(state.rotate, 10) + 1).toString(),
        });
      }
    },
    moveShapeRight: () => {
      if (state.rotate > -179) {
        setState({
          ...state,
          rotate: (parseInt(state.rotate, 10) - 1).toString(),
        });
      }
    },
  };

  return (
    <GlobalHotKeys allowChanges={true} keyMap={keyMap} handlers={handlers}>
      <Toolbar
        isSubmitDisabled={isSubmitDisabled}
        onSubmit={onSubmitOverride}
        onReset={() => setState({ ...state, rotate: expectedAngle })}
      >
        <ToolbarButtonContainer classModifier="filters">
          <ToolbarProgressButton
            classModifier="width-image"
            label="Image size"
            id="width-image"
            value={state.widthImage}
            onChange={e => setState({ ...state, widthImage: e.target.value })}
            type="range"
            name="width"
            min="20"
            max="100"
          />
          <ToolbarProgressButton
            classModifier="opacity"
            label="Opacité"
            id="opacity"
            value={state.opacity}
            onChange={e => setState({ ...state, opacity: e.target.value })}
            type="range"
            name="rotate"
            step="0.1"
            min="0"
            max="1"
          />
        </ToolbarButtonContainer>
        <ToolbarButtonContainer classModifier="light-grid">
          <ToolbarSwitchButton
            id="light-grid"
            checked={!state.lightGrid}
            onChange={() => setState({ ...state, lightGrid: !state.lightGrid })}
            label="Dark mode"
          />
          <ToolbarSwitchButton
            classModifier="anomaly"
            id="anomaly"
            checked={state.imageAnomaly}
            onChange={() => setState({ ...state, imageAnomaly: !state.imageAnomaly })}
            label="Anomalie"
          />
        </ToolbarButtonContainer>
        <ToolbarButtonContainer>
          <ToolbarProgressButton
            classModifier="angle"
            label={`Angle: ${state.rotate}°`}
            id="angle"
            onChange={e => setState({ ...state, rotate: e.target.value })}
            value={state.rotate}
            type="range"
            step="1"
            name="rotate"
            min="-179"
            max="180"
          />
        </ToolbarButtonContainer>
      </Toolbar>
    </GlobalHotKeys>
  );
};

export default React.memo(ToolbarContainer);

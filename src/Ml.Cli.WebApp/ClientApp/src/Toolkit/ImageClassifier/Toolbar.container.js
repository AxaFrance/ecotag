import React from 'react';
import { GlobalHotKeys } from 'react-hotkeys';
import {ToolbarButtonContainer, ToolbarButton, ToolbarProgressButton, ToolbarSwitchButton} from '../Toolbar';

const ToolbarContainer = ({ state, setState }) => {
  const getImageInfo = () => {
    const image = document.getElementById('currentImage');
    const imageWidth = image.width;
    const imageHeight = image.height;
    return {
      imageWidth,
      imageHeight,
    };
  };

  const rotateImage = value => {
    const { imageWidth, imageHeight } = getImageInfo();
    const margin = (Math.max(imageWidth, imageHeight) - Math.min(imageWidth, imageHeight)) / 2;
    const orientation = imageWidth > imageHeight ? 'horizontal' : 'vertical';
    const construcMargin = orientation === 'horizontal' ? `${margin}px -${margin}px` : `-${margin}px ${margin}px`;
    setState({
      ...state,
      marginRotate: construcMargin,
      rotate: value === 'right' ? state.rotate + 90 : state.rotate - 90,
      initialRotate: !state.initialRotate,
    });
  };

  const inlineMode = () => {
    setState({ ...state, inlineMode: !state.inlineMode });
  };

  const keyMap = {
    Submit: 'ctrl+spacebar',
    RotateLeft: 'l',
    RotateRight: 'r',
    InlineMode: 'i',
  };

  const handlers = {
    RotateRight: () => rotateImage('right'),
    RotateLeft: rotateImage,
    InlineMode: inlineMode,
  };

  return (
    <div className="toolbar">
      <GlobalHotKeys allowChanges={true} keyMap={keyMap} handlers={handlers}>
          <ToolbarButtonContainer classModifier="progress-bar">
            <ToolbarProgressButton
              label="Image Size"
              onChange={e => setState({ ...state, widthImage: e.target.value })}
              value={state.widthImage}
              min="1"
              max="80"
            />
            <ToolbarSwitchButton id="inlineMode" checked={state.inlineMode} onChange={inlineMode} label="Inline mode" />
          </ToolbarButtonContainer>
          <ToolbarButtonContainer>
            <ToolbarButton title="Raccourci : L" onClick={rotateImage} icon="reset" label="Rotate Left" />
            <ToolbarButton
              title="Raccourci : R"
              onClick={() => rotateImage('right')}
              icon="repeat"
              label="Rotate Right"
            />
          </ToolbarButtonContainer>
      </GlobalHotKeys>
    </div>
  );
};

export default ToolbarContainer;

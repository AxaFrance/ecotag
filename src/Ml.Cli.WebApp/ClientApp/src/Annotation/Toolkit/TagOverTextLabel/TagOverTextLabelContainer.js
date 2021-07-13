import React, { useEffect, useRef, useState } from 'react';
import Toolbar from './Toolbar';
import Cropping from '../BoundingBox/Cropping';
import Labels from './Labels';
import useImage from 'use-image';
import './TagOverTextLabelContainer.scss';
import '@axa-fr/react-toolkit-core/dist/assets/fonts/icons/af-icons.css';
import stringToRGB from '../BoundingBox/color';
import cuid from 'cuid';
import './ComponentsModifier.scss';

const fitImage = (image, croppingWidth, croppingHeight) => {
  let scaleHeight = 1;
  let scaleWith = 1;
  if (croppingHeight < image.height) {
    scaleHeight = croppingHeight / image.height;
  }
  if (croppingWidth < image.width) {
    scaleWith = croppingWidth / image.width;
  }
  const stageScale = scaleHeight < scaleWith ? scaleHeight : scaleWith;
  return {
    stageScale,
    stageX: 0,
    stageY: 0,
    imageWidth: image.width,
    imageHeight: image.height,
  };
};

const getStroke = () => {
  function stroke(state) {
    if (this.labelGroupId) {
      return state.labelGroup[this.labelGroupId].color;
    }
    if (this.labelGroupId !== null) {
      return 'rgb(180, 180, 180)';
    }
    return 'rgb(180, 180, 180)';
  }
  return stroke;
};

function strokeWidth(state) {
  if (this.focus) {
    return 4 / state.stageScale;
  }
  return 2 / state.stageScale;
}

function opacity() {
  if (this.focus) {
    return 0.5;
  }
  return 1;
}

const TagOverTextLabelContainer = ({ expectedOutput, url, onSubmit, labels }) => {
  const labelsWithColor = labels.map((label, index) => {
    return {
      id: index.toString(),
      label: label.name,
      color: '#' + stringToRGB(index + label.name),
    };
  });
  const containerRef = useRef(null);
  const croppingWidth = (window.innerWidth * 70) / 100 - 100; // -100 correspond au padding 50 50 sur l'annotation-zone
  const croppingHeight = (window.innerHeight * 85) / 100;
  const initialState = {
    shapes: [],
    stageScale: 1,
    stageX: 0,
    stageY: 0,
    isHoverCanvas: false,
    imageHeight: null,
    imageWidth: null,
    onMouseMove: null,
    onMouseDown: false,
    onTransform: false,
    onDrag: false,
    labels: [],
    labelGroup: labelsWithColor,
    currentLabelId: '0',
  };

  const [state, setState] = useState(initialState);
  const [image] = useImage(url);

  useEffect(() => {
    /*if (containerRef.current.scrollIntoView) {
      containerRef.current.scrollIntoView({
        block: 'start',
        behavior: 'smooth',
      });
    }*/

    if (image) {
      const labels = expectedOutput.map(label => {
        return {
          id: label.id,
          label: label.text,
        };
      });
      const initialShapes = expectedOutput.map(e => {
        const labelId = e.id;
        return {
          begin: { x: e.left, y: e.top },
          end: { x: e.left + e.width, y: e.top + e.height },
          id: cuid(),
          labelGroupId: null,
          stroke: getStroke(),
          focus: false,
          draggable: false,
          transformable: false,
          deletable: false,
          strokeWidth,
          opacity,
          labelId,
        };
      });
      setState({
        ...state,
        labels,
        ...fitImage(image, croppingWidth, croppingHeight),
        shapes: initialShapes,
      });
    }
  }, [image, expectedOutput, containerRef.current]);

  const onMouseLeaveCropping = () => {
    setState({ ...state, isHoverCanvas: false });
  };

  const onMouseEnterCropping = () => {
    setState({ ...state, isHoverCanvas: true });
  };

  const initShape = (state, shape) => {
    const labels = state.labels;
    const nextLabelId = shape.labelId;
    const newLabel = {
      id: nextLabelId,
      index: labels.length + 1,
      label: '',
      defaultLabel: '',
      block_num: 999999,
      conf: 100,
      manual_rectangle: true,
      hasBeenFocused: true,
      isEmptyConfirmed: false,
    };
    return {
      newTempState: {
        ...state,
        labels: [...state.labels, newLabel],
      },
      newShape: {
        ...shape,
        color: '',
        stroke: getStroke(),
        strokeWidth,
        opacity,
        deletable: true,
      },
    };
  };

  const onFocus = shape => {
    if (shape.labelGroupId === null) {
      shape.labelGroupId = state.currentLabelId;
      return shape;
    }
    if (shape.labelGroupId === state.currentLabelId) {
      shape.labelGroupId = null;
      return shape;
    }
    if (shape.labelGroupId !== state.currentLabelId) {
      shape.labelGroupId = state.currentLabelId;
      return shape;
    }
    return shape;
  };

  return (
    <div className="totl totl--container-adapter">
      <div className="totl__container" ref={containerRef}>
        <div className="totl__annotation-zone" onMouseLeave={onMouseLeaveCropping} onMouseEnter={onMouseEnterCropping}>
          <Cropping
            currentLabelId={null}
            state={state}
            setState={setState}
            croppingWidth={croppingWidth}
            croppingHeight={croppingHeight}
            image={image}
            initShape={null}
            onFocus={onFocus}
          />
        </div>
        <div className="totl__labels-list">
          <Labels state={state} setState={setState} labels={labelsWithColor} />
        </div>
      </div>
      <Toolbar
        state={state}
        setState={setState}
        fitImage={() => fitImage(image, croppingWidth, croppingHeight)}
        onSubmit={onSubmit}
        image={image}
        expectedOutput={expectedOutput}
      />
    </div>
  );
};

export default React.memo(TagOverTextLabelContainer);

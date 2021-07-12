import React, { useEffect, useRef, useState } from 'react';
import Toolbar from './Toolbar.container';
import Cropping from './Cropping';
import Labels from './Labels';
import stringToRGB from './color';
import useImage from 'use-image';
import './CroppingContainer.scss';

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

const prevStateWithRatioImage = (previousShapes, newImage, previousImageWidth, previousImageHeight) => {
  // Permet a la feature keepAnnotation d'utiliser des ratios plutôt que des données absolues
  const heightRatio = previousImageHeight / newImage.height;
  const widthRatio = previousImageWidth / newImage.width;

  return previousShapes.map(shape => {
    return {
      ...shape,
      begin: {
        x: shape.begin.x / widthRatio,
        y: shape.begin.y / heightRatio,
      },
      end: {
        x: shape.end.x / widthRatio,
        y: shape.end.y / heightRatio,
      },
    };
  });
};

const CroppingContainer = ({ labels, url, onSubmit }) => {
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
    color: 'green',
    stageScale: 1,
    rotationDeg:0,
    stageX: 0,
    stageY: 0,
    isHoverCanvas: false,
    currentLabelId: '',
    keepAnnotation: false,
    imageHeight: null,
    imageWidth: null,
    onMouseMove: null,
    onMouseDown: false,
    onTransform: false,
    onMoveImage: false,
    moveImageActive: false,
    onDrag: false,
  };

  const [state, setState] = useState(initialState);
  const [image] = useImage(url);

  useEffect(() => {
    if (containerRef.current.scrollIntoView) {
      containerRef.current.scrollIntoView({
        block: 'start',
        behavior: 'smooth',
      });
    }
    const currentLabelId = labelsWithColor[0].id;
    if (image) {
      if (state.keepAnnotation) {
        setState({
          ...state,
          currentLabelId,
          shapes: prevStateWithRatioImage(state.shapes, image, state.imageWidth, state.imageHeight),
        });
      } else {
        setState({
          ...state,
          ...fitImage(image, croppingWidth, croppingHeight),
          currentLabelId,
          shapes: [],
        });
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [image, labels]);

  const onMouseLeaveCropping = () => {
    setState({ ...state, isHoverCanvas: false, onMoveImage:false });
  };

  const onMouseEnterCropping = () => {
    setState({ ...state, isHoverCanvas: true });
  };

  const initShape = (state, shape) => {
    return {
      newTempState: state,
      newShape: {
        ...shape,
        color: labelsWithColor.find(l => l.id === shape.labelId).color,
      },
    };
  };

  let authorizedCroppingZone = null;
  if(image){
    let max = image.width > image.height ? image.width : image.height;
    authorizedCroppingZone = {
      width: max,
      height:max,
    }
  }
  
  return (
    <div className="cropping">
      <div className="cropping__container" ref={containerRef}>
        <div
          className="cropping__annotation-zone"
          onMouseLeave={onMouseLeaveCropping}
          onMouseEnter={onMouseEnterCropping}>
          <Cropping
            currentLabelId={state.currentLabelId}
            state={state}
            setState={setState}
            croppingWidth={croppingWidth}
            croppingHeight={croppingHeight}
            image={image}
            authorizedCroppingZone={authorizedCroppingZone}
            initShape={initShape}
            moveImageActive={state.moveImageActive}
          />
        </div>
        <div className="cropping__labels-list">
          <Labels labels={labelsWithColor} state={state} setState={setState} />
        </div>
      </div>
      <Toolbar
        labels={labelsWithColor}
        state={state}
        setState={setState}
        fitImage={() => fitImage(image, croppingWidth, croppingHeight)}
        onSubmit={onSubmit}
        image={image}
        initShape={initShape}
      />
    </div>
  );
};

export default React.memo(CroppingContainer);

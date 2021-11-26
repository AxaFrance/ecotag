import React from 'react';

import './Irot.scss';

const Irot = ({ state, setState, url }) => {
  const onImageLoad = ({ target: image }) => {
    setState({
      ...state,
      imageDimensions: { height: image.offsetHeight, width: image.offsetWidth },
    });
  };

  return (
    <div className={state.lightGrid ? 'irot irot--light' : 'irot irot--dark'}>
      <div className="irot__container">
        <img
          onLoad={onImageLoad}
          className="irot__item"
          id="currentImage"
          src={url}
          style={{
            width: `${state.widthImage}%`,
            transform: `rotate(${-state.rotate}deg)`,
            opacity: `${state.opacity}`,
            margin: `${state.initialRotate ? '' : state.marginRotate}`,
          }}
         alt="Image to rotate"/>
      </div>
    </div>
  );
};

export default React.memo(Irot);

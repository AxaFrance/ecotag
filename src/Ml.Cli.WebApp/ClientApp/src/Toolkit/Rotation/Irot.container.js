import React, { useEffect, useState } from 'react';
import Irot from './Irot';
import Toolbar from './Toolbar';

const getExpectedAngle = expectedLabels => {
  let expectedAngle = '0';
  if (expectedLabels && expectedLabels.angle !== undefined && expectedLabels.angle != null) {
    expectedAngle = expectedLabels.angle.toString();
  }
  return expectedAngle;
};

const IrotContainer = ({ url, expectedLabels, onSubmit, defaultImageDimensions = { height: 0, width: 0 } }) => {
  const [state, setState] = useState({
    rotate: '0',
    widthImage: '100',
    marginRotate: '0',
    opacity: '1',
    lightGrid: true,
    imageDimensions: defaultImageDimensions,
    imageAnomaly: false,
  });

  const expectedAngle = getExpectedAngle(expectedLabels);
  useEffect(() => {
    setState({ ...state, rotate: expectedAngle, imageAnomaly: false });
  }, [url, expectedLabels]);

  return (
    <div className="rotation-container-adapter">
      <Irot state={state} setState={setState} url={url} />
      <Toolbar url={url} state={state} setState={setState} onSubmit={onSubmit} expectedAngle={expectedAngle} />
    </div>
  );
};

export default React.memo(IrotContainer);

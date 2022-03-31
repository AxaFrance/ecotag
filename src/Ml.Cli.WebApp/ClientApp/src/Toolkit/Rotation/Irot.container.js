import React, { useEffect, useState } from 'react';
import Irot from './Irot';
import Toolbar from './Toolbar';

const formatExpectedOutput = expectedOutput => {
  if (!expectedOutput) {
    return {
      rotate: '0',
      imageAnomaly: false
    };
  }
  let expectedAngle = '0';
  if (expectedOutput && expectedOutput.labels && expectedOutput.labels.angle) {
    expectedAngle = expectedOutput.labels.angle.toString();
  }
  return {
    rotate: expectedAngle,
    imageAnomaly: expectedOutput.image_anomaly
  };
}

const IrotContainer = ({ url, onSubmit, expectedOutput=null, defaultImageDimensions = { height: 0, width: 0 } }) => {
  const [state, setState] = useState({
    rotate: '0',
    widthImage: '100',
    marginRotate: '0',
    opacity: '1',
    lightGrid: true,
    imageDimensions: defaultImageDimensions,
    imageAnomaly: false,
  });
  const formattedExpectedOutput = formatExpectedOutput(expectedOutput);
  useEffect(() => {
    setState({ ...state, ...formattedExpectedOutput });
  }, [url, expectedOutput]);

  return (
    <div className="rotation-container-adapter">
      <Irot state={state} setState={setState} url={url} />
      <Toolbar url={url} state={state} setState={setState} onSubmit={onSubmit} expectedAngle={formattedExpectedOutput.rotate} />
    </div>
  );
};

export default React.memo(IrotContainer);

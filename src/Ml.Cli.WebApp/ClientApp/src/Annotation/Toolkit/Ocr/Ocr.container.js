import React, { useState, useEffect } from 'react';
import Ocr from './Ocr';
import Toolbar from './Toolbar';
import './Ocr.scss';
import '@axa-fr/react-toolkit-core/dist/assets/fonts/icons/af-icons.css';

const OcrContainer = ({ labels, expectedLabels, url, onSubmit }) => {
  const [state, setState] = useState({
    labels,
    url,
    rotate: 0,
    widthImage: 80,
    inlineMode: false,
    marginRotate: 0,
    initialRotate: true,
    userInput: {},
  });

  useEffect(() => {
    const userInput = {};
    if (expectedLabels && expectedLabels.length > 0) {
      labels.map(label => {
        userInput[label.name] = expectedLabels[label.name] || '';
      });
      setState({ ...state, userInput });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [url]);

  return (
    <>
      <Ocr state={state} setState={setState} url={url} />
      <Toolbar onSubmit={onSubmit} state={state} setState={setState} />
    </>
  );
};

export default React.memo(OcrContainer);

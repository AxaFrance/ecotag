import React from 'react';
import { storiesOf } from '@storybook/react';
import OcrContainer from "./index";
import url from "./sample_image.png";

const labels =   [{name: "Eyes color", id: 0}, {name: "Description", id: 1}];

const onSubmit = (e) => {
  console.log("Submit Method", e);
};

storiesOf('Ocr', module).add('OcrContainer', () => (
  <OcrContainer labels={labels} expectedLabels={[]} url={url} onSubmit={onSubmit} />
));

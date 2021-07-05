import React from 'react';
import { storiesOf } from '@storybook/react';
import OcrContainer from "./index";
import url from "./sample_rib.png";

const labels =   [{name: "Recto", color: "#212121", id: 0}, {name: "Verso", color: "#ffbb00", id: 1}, {name: "Signature", color: "#f20713", id: 2}];

const onSubmit = (e) => {
  console.log("Submit Method", e);
};

storiesOf('Ocr', module).add('OcrContainer', () => (
  <OcrContainer labels={labels} expectedLabels={[]} url={url} onSubmit={onSubmit} />
));

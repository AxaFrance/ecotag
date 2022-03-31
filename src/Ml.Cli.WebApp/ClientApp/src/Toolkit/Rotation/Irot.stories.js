import React from 'react';
import { storiesOf } from '@storybook/react';
import IrotContainer from "./Irot.container";
import url from "./sample_image.png";

const onSubmit = (e) => {
  console.log("submit", e);
};

const expectedOutput = {
      labels: {"angle": -30},
      image_anomaly : false
    };

storiesOf('Rotation', module).add('RotationContainer', () => (
  <IrotContainer url={url} onSubmit={onSubmit} expectedOutput={expectedOutput} />
));

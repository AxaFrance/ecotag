import React from 'react';
import { storiesOf } from '@storybook/react';
import IrotContainer from "./Irot.container";
import url from "./sample_image.png";

const onSubmit = (e) => {
  console.log("submit", e);
};

const expectedLabels = {"angle": -30};

storiesOf('Rotation', module).add('RotationContainer', () => (
  <IrotContainer url={url} onSubmit={onSubmit} expectedLabels={expectedLabels} />
));

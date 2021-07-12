import React from 'react';
import { storiesOf } from '@storybook/react';
import CroppingContainer from './CroppingContainer';
import url from "./sample_image.png";

const labels = require("./labels.json");

const onSubmit = (data) => {
  console.log(data);
};

storiesOf('Cropping', module).add('CroppingContainer', () => (
  <CroppingContainer labels={labels} url={url} onSubmit={onSubmit} />
));

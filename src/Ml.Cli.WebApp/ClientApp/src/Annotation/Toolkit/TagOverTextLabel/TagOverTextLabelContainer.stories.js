import React from 'react';
import { storiesOf } from '@storybook/react';
import TagOverTextLabelContainer from './TagOverTextLabelContainer';
import labels from "./Labels.json";

import url from "./sample_image.png";

const expectedOutput = require("./expectedOutput");

const onSubmit = data => {
  console.log(data);
};

storiesOf('TagOverTextLabel', module).add('TagOverTextLabelContainer', () => (
  <TagOverTextLabelContainer expectedOutput={expectedOutput.boundingBoxes} url={url} onSubmit={onSubmit} labels={labels}/>
));

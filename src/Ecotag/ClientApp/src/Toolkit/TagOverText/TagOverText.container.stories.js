import React from 'react';
import {storiesOf} from '@storybook/react';
import TagOverTextContainer from './TagOverText.container';

import url from "./sample_image.png";

const expectedOutput = require("./expectedOutput");

const onSubmit = (data) => {
    console.log(data);
};

storiesOf('TagOverText', module).add('TagOverTextContainer', () => (
    <TagOverTextContainer expectedOutput={expectedOutput.boundingBoxes} url={url} onSubmit={onSubmit}/>
));

import React from 'react';
import {storiesOf} from '@storybook/react';
import url from "./sample_image.png";
import CroppingContainer from "./Cropping.container";

const labels = require("./labels.json");

const onSubmit = (data) => {
    console.log(data);
};

storiesOf('Cropping', module).add('CroppingContainer', () => (
    <CroppingContainer labels={labels} url={url} onSubmit={onSubmit} expectedOutput={null}/>
));

import React from "react";
import ImageClassifier from "./ImageClassifier";
import url from "./sample_image.png";
import ImageClassifierContainer from "./ImageClassifier.container";

const mockedFunction = () => {};

const labels = [{name: "Dog"}, {name: "Cat"}, {name: "Duck"}, {name: "Other"}];

export default {
    title: 'ImageClassifier',
    component: ImageClassifier
}

const Template = (args) => <ImageClassifierContainer {...args}/>;

export const Default = Template.bind({});
Default.args = {
    url: url,
    labels: labels,
    onSubmit: mockedFunction
};
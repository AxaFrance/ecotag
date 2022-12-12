import React from "react";
import EmlClassifier from "./EmlClassifier";
import {EmlMode} from "./EmlMode";

const mockedFunction = (labelName) => {
    console.log(labelName)
};

const labels = [{name: "Dog"}, {name: "Cat"}, {name: "Duck"}, {name: "Other"}, {name: "Dog1"}, {name: "Cat1"}, {name: "Duck1"}, {name: "Other2"}, {name: "Dog3"}, {name: "Cat3"}, {name: "Duck3"}];

export default {
    title: 'EmlClassifier',
    component: EmlClassifier
}

const Template = (args) => <EmlClassifier {...args}/>;

export const Default = Template.bind({});
Default.args = {
    labels: labels,
    onSubmit: mockedFunction
};


export const DefaultOcr = Template.bind({});
DefaultOcr.args = {
    labels: labels,
    mode: EmlMode.ocr,
    onSubmit: mockedFunction
};
import React from "react";
import EmlClassifier from "./EmlClassifier";
import {EmlMode} from "./EmlMode";

const mockedFunction = (labelName) => {console.log(labelName)};

const labels = [{name: "Dog"}, {name: "Cat"}, {name: "Duck"}, {name: "Other"}];

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
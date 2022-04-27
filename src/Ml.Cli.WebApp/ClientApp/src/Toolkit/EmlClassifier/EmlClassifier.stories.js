import React from "react";
import EmlClassifier from "./EmlClassifier";

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
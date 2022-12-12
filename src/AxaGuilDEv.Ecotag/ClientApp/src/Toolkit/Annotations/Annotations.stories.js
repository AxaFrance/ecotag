import React from "react";
import Annotations from "./Annotations";

export default {
    title: 'Annotations',
    component: Annotations
};

const Template = (args) => <Annotations {...args}/>;

export const Default = Template.bind({});
Default.args = {
    onPrevious: () => {
        console.log("onPrevious");
    },
    onNext: () => {
        console.log("onPrevious");
    },
    onSubmit: () => {
        console.log("onPrevious");
    },
    isPreviousDisabled: false,
    toolbarText: "filename.text",
    isNextDisabled: false,
    annotationType: "NamedEntityRecognition",
    expectedOutput: null,
    url: null,
    isEmpty: false,
    labels: [{id: "#008194", name: "Firstname", color: "#008194"}, {id: "#00ffa2", name: "Lastname", color: "#00ffa2"}]
};
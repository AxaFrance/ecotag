import React from "react";
import Annotate from "./Annotate";

export default {
    title: 'Annotation',
    component: Annotate
};

const Template = (args) => <Annotate {...args} />;

export const Default = Template.bind({});
Default.args = {
    state: {
        fileName: "Annoter un dataset"
    }
};

Default.parameters = {
    controls: {
        disabled: true
    }
};

import React from "react";
import DatasetHandler from "./DatasetHandler";

export default {
    title: 'DatasetHandler',
    component: DatasetHandler
};

const Template = (args) => <DatasetHandler {...args} />;

export const Default = Template.bind({});
Default.args = {
    state: {
        fileName: "fileName",
        datasetLocation: "C:\\\\location",
        annotationType: "JsonEditor",
        configuration: "{}",
        items: []
    }
};

Default.parameters = {
    controls: {
        disabled: true
    }
}

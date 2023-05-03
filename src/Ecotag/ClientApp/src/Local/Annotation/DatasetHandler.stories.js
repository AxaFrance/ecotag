import React from "react";
import DatasetHandler from "./DatasetHandler";

export default {
    title: 'DatasetHandler',
    component: DatasetHandler
};

const mockedFetch = () => ({status: 500});

const Template = (args) => <DatasetHandler {...args} />;

export const Default = Template.bind({});
Default.args = {
    state: {
        fileName: "fileName",
        datasetLocation: "C:\\\\location",
        annotationType: "JsonEditor",
        configuration: "{}",
        items: []
    },
    fetch: mockedFetch
};

Default.parameters = {
    controls: {
        disabled: true
    }
}

import React from "react";
import JsonEditorSave from "./JsonEditorSave";

const mockedFunction = () => {
}

export default {
    title: 'Design System/JsonEditor/JsonEditorSave',
    component: JsonEditorSave
}

const Template = (args) => <JsonEditorSave {...args} />;

export const Default = Template.bind({});
Default.args = {
    onSubmit: mockedFunction
}
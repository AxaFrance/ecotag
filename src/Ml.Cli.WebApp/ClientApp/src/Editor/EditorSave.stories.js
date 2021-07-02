import React from "react";
import EditorSave from './EditorSave';

const mockedFunction = () => {
}

export default {
    title: 'Design System/Editor/EditorSave',
    component: EditorSave
}

const Template = (args) => <EditorSave {...args} />;

export const Default = Template.bind({});
Default.args = {
    onSubmit: mockedFunction
}
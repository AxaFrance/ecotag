import React from "react";
import EditorContainer from './EditorContainer';

const mockedFunction = () => {
}

export default {
    title: 'Design System/Editor/EditorContainer',
    component: EditorContainer
};

const MonacoEditor = React.lazy(() => import("@monaco-editor/react"));

const Template = (args) => <EditorContainer {...args} />;

export const Default = Template.bind({});
Default.args = {
    expectedOutput: {
        id: "Editor_Container_id",
        value: `{"value": "This is the content of the editor"}`,
        fileName: "File Name"
    },
    urls: [],
    onSubmit: mockedFunction,
    MonacoEditor: MonacoEditor
};

export const ErrorMessage = Template.bind({});
ErrorMessage.args = {
    expectedOutput: {
        id: "Editor_Container_id",
        value: "{",
        fileName: "[File Name]"
    },
    urls: [],
    onSubmit: mockedFunction,
    MonacoEditor: MonacoEditor
};

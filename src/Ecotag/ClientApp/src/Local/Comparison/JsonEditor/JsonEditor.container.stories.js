import React from "react";
import JsonEditorContainer from "./JsonEditor.container";

const mockedFunction = () => {
}

export default {
    title: 'Design System/JsonEditor/JsonEditorContainer',
    component: JsonEditorContainer
};

const MonacoEditor = React.lazy(() => import("@monaco-editor/react"));

const Template = (args) => <JsonEditorContainer {...args} />;

export const Default = Template.bind({});
Default.args = {
    expectedOutput: {
        id: "JsonEditor.container_id",
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
        id: "JsonEditor.container_id",
        value: "{",
        fileName: "[File Name]"
    },
    urls: [],
    onSubmit: mockedFunction,
    MonacoEditor: MonacoEditor
};

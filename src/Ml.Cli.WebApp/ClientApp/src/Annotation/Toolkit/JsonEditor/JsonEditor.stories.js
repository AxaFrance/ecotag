import React from "react";
import JsonEditor from "./JsonEditor";

let editorContent = `Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vestibulum condimentum elit turpis, et rutrum ante aliquam in. Ut egestas, dui vel vulputate auctor, nunc risus scelerisque elit, quis rutrum odio augue eu lacus. Nullam laoreet erat sed feugiat tristique. Praesent rutrum mi turpis, et facilisis odio varius vel. Aenean lacinia neque urna, sit amet posuere sem elementum et. Donec finibus et lectus et iaculis. Donec et commodo nulla.
Nulla hendrerit enim nec purus tristique, quis elementum ipsum porttitor. Duis tristique accumsan urna id bibendum. Fusce vel elit risus. Proin tellus lacus, aliquam nec pulvinar quis, vulputate eu neque. Proin molestie.`;

const mockedFunction = () => {
}

const MonacoEditor = React.lazy(() => import("@monaco-editor/react"));

export default {
    title: 'Design System/Editor/Editor',
    component: JsonEditor,
    argTypes: {
        MonacoEditor: {
            table: {
                disable: true
            }
        }
    }
}

const Template = (args) => <JsonEditor {...args} />;

export const Default = Template.bind({});
Default.args = {
    id: "JsonEditor_id",
    value: editorContent,
    onChange: mockedFunction,
    MonacoEditor: MonacoEditor
}
import React from "react";
import EditorTab from "./EditorTab";
import {QueryClient, QueryClientProvider} from "react-query";

const queryClient = new QueryClient();

const item = {
    collapse:true,
    fileName:"{FileNameOK}_pdf.json",
    id:"id",
    left:{
        Body:"[{\"firstname\":\"firstname\",\"lastname\":\"lastname\",\"birthdate\":\"birthdate\",\"categoryB\":\"categoryB\"}]",
        FrontDefaultRegex:"",
        ImageDirectory:"",
        FileDirectory:"file_directory",
        StatusCode:200,
        TimeMs:0,
        Url:"https://url"
    },
    right:{
        Body:"[{\"firstname\":\"firstname\",\"lastname\":\"lastname\",\"birthdate\":\"birthdate\",\"categoryB\":\"categoryB\"}]",
        FrontDefaultRegex: "",
        ImageDirectory: "",
        FileDirectory:"file_directory",
        StatusCode:200,
        TimeMs:0,
        Url:"https://url"
    }
}

const MonacoEditor = React.lazy(() => import("@monaco-editor/react"));

const mockedFunction = () => {};
const mockedFetchFunction = async (queryUrl, data) => Promise.resolve({ok: false, status: 400, statusText: "Bad Request", bodyUsed: false});

export default {
    title: 'Design System/Editor/EditorTab',
    component: EditorTab,
    argTypes: {
        MonacoEditor: {
            table: {
                disable: true
            }
        }
    }
};

const Template = (args) => <QueryClientProvider client={queryClient}>
    <EditorTab {...args} />
</QueryClientProvider>;

export const Default = Template.bind({});
Default.args = {
    items: [],
    item: item,
    stringsMatcher: "",
    compareLocation: "",
    MonacoEditor: MonacoEditor,
    setCompareState: mockedFunction,
    fetchFunction: mockedFetchFunction,
}

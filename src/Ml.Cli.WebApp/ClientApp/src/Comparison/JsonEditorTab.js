import React from "react";
import {useMutation} from "react-query";
import {Tabs} from "@axa-fr/react-toolkit-all";
import './JsonEditorTab.scss';
import ImagesLoader from "./ImagesLoader";
import {fetchPostJson} from "../FetchHelper";

const left_var = "left";
const right_var = "right";

const setNewItem = (contentLeft, contentRight, items, item) => {
    return items.map(currentItem => {
        if (currentItem.fileName === item.fileName) {
            const newObject = {...currentItem};
            newObject.left.Body = contentLeft;
            newObject.right.Body = contentRight;
            return newObject;
        } else {
            return currentItem;
        }
    });
};

const JsonEditorTab = ({items, item, stringsMatcher, compareLocation, setCompareState, MonacoEditor, fetchFunction}) => {

    const mutationCompare = useMutation(newData => fetchPostJson(fetchFunction)("/api/compares", newData));
    const mutationJson = useMutation(newData => fetchPostJson(fetchFunction)("/api/datasets", newData));

    const saveItem = (direction, editorContent) => {
        const {left, right} = item;
        const contentLeft = direction === left_var ? editorContent : left.Body;
        const contentRight = direction === right_var ? editorContent : right.Body;
        const newItems = setNewItem(
            contentLeft,
            contentRight,
            items,
            item
        );
        let fileName, jsonContent;
        if (direction === left) {
            fileName = left.FileDirectory;
            left.Body = editorContent;
            jsonContent = left;
        } else {
            fileName = right.FileDirectory;
            right.Body = editorContent;
            jsonContent = right;
        }
        const tempObject = {compareLocation, fileDirectory: fileName, content: JSON.stringify(item)};
        mutationCompare.mutate(tempObject);
        mutationJson.mutate(jsonContent);
        setCompareState({items: newItems});
    };

    return <div className="editor-tab">
        <Tabs className="editor-tab__header">
            <Tabs.Tab title="Left">
                <ImagesLoader
                    expectedOutput={{id: `${item.fileName}_left`, value: item.left.Body, fileName: item.fileName}}
                    onSubmit={e => saveItem(left_var, e)}
                    item={item}
                    stringsMatcher={stringsMatcher}
                    direction={left_var}
                    MonacoEditor={MonacoEditor}
                    fetchFunction={fetchFunction}
                />
            </Tabs.Tab>
            <Tabs.Tab title="Right">
                <ImagesLoader
                    expectedOutput={{id: `${item.fileName}_right`, value: item.right.Body, fileName: item.fileName}}
                    onSubmit={e => saveItem(right_var, e)}
                    item={item}
                    stringsMatcher={stringsMatcher}
                    direction={right_var}
                    MonacoEditor={MonacoEditor}
                    fetchFunction={fetchFunction}
                />
            </Tabs.Tab>
        </Tabs>
    </div>;
};

export default JsonEditorTab;

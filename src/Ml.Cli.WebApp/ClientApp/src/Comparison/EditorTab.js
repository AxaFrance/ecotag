import React from "react";
import {useMutation} from "react-query";
import {Tabs} from "@axa-fr/react-toolkit-all";
import './EditorTab.scss';
import ImagesLoader from "./ImagesLoader";
import {fetchPostJson} from "../FetchHelper";

const left = "left";
const right = "right";

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

const EditorTab = ({items, item, stringsMatcher, compareLocation, setCompareState, MonacoEditor, fetchFunction}) => {

    const mutationCompare = useMutation(newData => fetchPostJson(newData, fetchFunction)("/api/compare/save"));
    const mutationJson = useMutation(newData => fetchPostJson(newData, fetchFunction)("/api/datasets/save"));

    const saveItem = (direction, editorContent) => {
        const {left, right} = item;
        const contentLeft = direction === left ? editorContent : left.Body;
        const contentRight = direction === right ? editorContent : right.Body;
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
            <Tabs.Tab title="Gauche">
                <ImagesLoader
                    expectedOutput={{id: `${item.fileName}_left`, value: item.left.Body, fileName: item.fileName}}
                    onSubmit={e => saveItem(left, e)}
                    item={item}
                    stringsMatcher={stringsMatcher}
                    direction={left}
                    MonacoEditor={MonacoEditor}
                    fetchFunction={fetchFunction}
                />
            </Tabs.Tab>
            <Tabs.Tab title="Droite">
                <ImagesLoader
                    expectedOutput={{id: `${item.fileName}_right`, value: item.right.Body, fileName: item.fileName}}
                    onSubmit={e => saveItem(right, e)}
                    item={item}
                    stringsMatcher={stringsMatcher}
                    direction={right}
                    MonacoEditor={MonacoEditor}
                    fetchFunction={fetchFunction}
                />
            </Tabs.Tab>
        </Tabs>
    </div>;
};

export default EditorTab;

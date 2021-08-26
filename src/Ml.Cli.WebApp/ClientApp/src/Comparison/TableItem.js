import React, {useEffect, useState} from "react";
import diff_match_patch from "diff-match-patch";
import JsonEditorTab from "./JsonEditorTab";

const dmp = new diff_match_patch();

const diff = (text1, text2) => {
    dmp.Diff_Timeout = parseFloat(10);
    const d = dmp.diff_main(text1, text2);
    dmp.diff_cleanupSemantic(d);
    return dmp.diff_prettyHtml(d);
};

const onCopy = (item, name) => {
    const element = document.createElement('textarea');
    if (name === "fileName") {
        element.value = item.fileName.substr(0, item.fileName.lastIndexOf('_'));
    } else if (name === "left") {
        element.value = item.left.FileDirectory;
    } else {
        element.value = item.right.FileDirectory;
    }
    document.body.appendChild(element)
    element.select()
    document.execCommand("copy")
    document.body.removeChild(element)
}

const TableItem = ({stringsMatcher, item, items, compareLocation, isAnnotating, setCompareState, MonacoEditor, fetchFunction}) => {

    const [state, setState] = useState({
        isAnnotating: isAnnotating,
        isNotCollapsed: true
    });
    
    useEffect(() => {
        setState({...state, isAnnotating});
    }, [isAnnotating]);

    return <div className="table-result">
        <div className="table-result__header">
            <div>
                <p>File result : {item.fileName}</p>
                <h2>{item.left.Body !== item.right.Body ?
                    <span className="table-result__row--red">KO</span> :
                    <span className="table-result__row--green">OK</span>} Time left - Time right ratio
                    : {(item.right.TimeMs - item.left.TimeMs) / 1000} seconds</h2>
            </div>
            <div className="table-result__buttons-group">
                <div className="table-result__copy-button" onClick={() => {
                    onCopy(item, "name");
                }}>Copy
                </div>
                <div className="table-result__collapse-button"
                     onClick={() => {
                         setState({...state, isNotCollapsed: !state.isNotCollapsed});
                     }}>{state.isNotCollapsed ? "-" : "+"}</div>
            </div>
        </div>
        {state.isNotCollapsed && (
            <>
                <div className="table-result__elements-container">
                    <button className="table-result__parse-button" type="button"
                            onClick={() => setState({...state, isAnnotating: !state.isAnnotating})}>
                        <span>{state.isAnnotating ? "Fermer Annotation" : "Annotate"}</span>
                    </button>
                </div>
                {state.isAnnotating &&
                    <JsonEditorTab
                        items={items}
                        item={item}
                        stringsMatcher={stringsMatcher}
                        compareLocation={compareLocation}
                        setCompareState={setCompareState}
                        MonacoEditor={MonacoEditor}
                        fetchFunction={fetchFunction}
                    />
                }
                <div className="table-result__column-container">
                    <div className="table-result__column">
                        <div className="table-margin">
                            <div>Copy the local file link:</div>
                            <button className="table-result__copy-clipboard-button" onClick={() => {
                                onCopy(item, "left");
                            }}>
                                Click here
                            </button>
                            <h3>{item.left.Url}</h3>
                            <div
                                className="table-result__column table-result__column--time-span">Time: {item.left.TimeMs / 1000} seconds
                            </div>
                            <div>{item.left.Body}</div>
                        </div>
                    </div>
                    <div className="table-result__column table-result__column--separator">
                        <div className="table-margin">
                            <div>Copy the local file link:</div>
                            <button className="table-result__copy-clipboard-button" onClick={() => {
                                onCopy(item, "right");
                            }}>
                                Click here
                            </button>
                            <h3>{item.right.Url}</h3>
                            <div className="table-result__column table-result__column--time-span">
                                Time: {item.right.TimeMs / 1000} seconds
                            </div>
                            <div>{item.right.Body}</div>
                        </div>
                    </div>
                </div>
                <div className="table-result__row table-result__row--overflow"
                     dangerouslySetInnerHTML={{__html: diff(item.left.Body, item.right.Body)}}
                />
            </>
        )}
    </div>;
};

export default TableItem;
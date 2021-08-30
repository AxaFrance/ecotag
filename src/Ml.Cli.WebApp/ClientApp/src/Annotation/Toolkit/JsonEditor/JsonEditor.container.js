import React, {useEffect, useState} from "react";
import './JsonEditor.container.scss'
import ImagesList from "./ImagesList";
import JsonEditor from "./JsonEditor";
import JsonEditorSave from "./JsonEditorSave";

const checkJSONValidity = content => {
    try {
        JSON.stringify(JSON.parse(content));
        return true;
    } catch {
        return false;
    }
};

const initContent = expectedOutput => {
    try {
        const editorValue = JSON.stringify(JSON.parse(expectedOutput.value), null, 2);
        return {editorValue, errorMessage: ""};
    } catch (error) {
        return {
            editorValue: "",
            errorMessage: `Impossible to parse item ${expectedOutput.fileName}. Please ensure the content of the file is valid JSON.`
        };
    }
};

const JsonEditorContainer = ({expectedOutput, urls, onSubmit, MonacoEditor}) => {

    const [state, setState] = useState({
        isJsonInvalid: false,
        editorContent: "",
        errorMessage: ""
    });

    useEffect(() => {
        const initResult = initContent(expectedOutput);
        setState({...state, editorContent: initResult.editorValue, errorMessage: initResult.errorMessage});
    }, []);

    const onSave = () => {
        if (checkJSONValidity(state.editorContent)) {
            setState({...state, isJsonInvalid: false});
            onSubmit(state.editorContent);
        } else {
            setState({...state, isJsonInvalid: true});
        }
    };

    return <div className="images-editor-container">
        <div className="images-editor-container__images_column">
            <ImagesList
                fileUrls={urls}
            />
        </div>
        <div className="editor-container">
            <JsonEditor
                id={expectedOutput.id}
                language="json"
                value={state.editorContent}
                onChange={e => setState({...state, editorContent: e})}
                MonacoEditor={MonacoEditor}
            />
            <div className="editor-container__errors-container">
                {state.isJsonInvalid &&
                <div className="editor-container__error-message"><span>The modified JSON is invalid ! Save procedure has been cancelled.</span>
                </div>
                }
                {state.errorMessage &&
                <div className="editor-container__error-message"><span>{state.errorMessage}</span></div>
                }
            </div>
            <div className="editor-container__button">
                <JsonEditorSave
                    onSubmit={onSave}
                />
            </div>
        </div>
    </div>;
};

export default JsonEditorContainer;

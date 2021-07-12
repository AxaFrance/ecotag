import React, {useEffect, useState} from "react";
import Editor from "./Editor";
import EditorSave from "./EditorSave";
import './EditorContainer.scss';
import ImagesList from "./ImagesList";

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
            errorMessage: `Impossible de parser l'item ${expectedOutput.fileName}. Veuillez vous assurer que le contenu de ce fichier est au format JSON.`
        };
    }
};

const EditorContainer = ({expectedOutput, urls, onSubmit, MonacoEditor}) => {

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
            <Editor
                id={expectedOutput.id}
                language="json"
                value={state.editorContent}
                onChange={e => setState({...state, editorContent: e})}
                MonacoEditor={MonacoEditor}
            />
            <div className="editor-container__errors-container">
                {state.isJsonInvalid &&
                <div className="editor-container__error-message"><span>Le JSON modifié est invalide ! La sauvegarde n'a pas été effectuée.</span>
                </div>
                }
                {state.errorMessage &&
                <div className="editor-container__error-message"><span>{state.errorMessage}</span></div>
                }
            </div>
            <div className="editor-container__button">
                <EditorSave
                    onSubmit={onSave}
                />
            </div>
        </div>
    </div>;
};

export default EditorContainer;

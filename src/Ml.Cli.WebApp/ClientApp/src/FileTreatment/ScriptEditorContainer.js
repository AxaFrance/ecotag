import React from "react";
import Button from "@axa-fr/react-toolkit-button";
import Editor from "../Annotation/Toolkit/JsonEditor/Editor";

const ScriptEditorContainer = ({fileTreatmentState, setFileTreatmentState, MonacoEditor}) => {

    function reinitJSFilters() {
        const reinitValueL = `
try { 
    let body = JSON.parse(rawBodyInput);
    rawBodyOutput = JSON.stringify(body);
} catch(ex) {
    console.log("Plantage parsing left");
    console.log(ex.toString());
    rawBodyOutput = rawBodyInput;
}`;
        const reinitValueR = `
try { 
    let body = JSON.parse(rawBodyInput);
    rawBodyOutput = JSON.stringify(body);
} catch(ex) {
    console.log("Plantage parsing right");
    console.log(ex.toString());
    rawBodyOutput = rawBodyInput;
}`;
        setFileTreatmentState({...fileTreatmentState, scriptEditorLeft: reinitValueL, scriptEditorRight: reinitValueR});
    }

    return <>
        <div className="tabs__container">
            <div className="tabs__function-filter">
                <label>filtre gauche</label>
                <Editor
                    id="fileTreatment_script_left_editor"
                    language="javascript"
                    value={fileTreatmentState.scriptEditorLeft}
                    onChange={e => setFileTreatmentState({...fileTreatmentState, scriptEditorLeft: e})}
                    MonacoEditor={MonacoEditor}
                />
            </div>
            <div className="tabs__function-filter">
                <label>filtre droite</label>
                <Editor
                    id="fileTreatment_script_right_editor"
                    language="javascript"
                    value={fileTreatmentState.scriptEditorRight}
                    onChange={e => setFileTreatmentState({...fileTreatmentState, scriptEditorRight: e})}
                    MonacoEditor={MonacoEditor}
                />
            </div>
        </div>
        <div className="tabs__container">
            <Button onClick={() => reinitJSFilters()}>Réinitialiser</Button>
        </div>
    </>;
};

export default ScriptEditorContainer;

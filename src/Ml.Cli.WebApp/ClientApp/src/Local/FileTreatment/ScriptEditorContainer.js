import React from "react";
import Button from "@axa-fr/react-toolkit-button";
import JsonEditor from "../Comparison/JsonEditor/JsonEditor";

const ScriptEditorContainer = ({fileTreatmentState, setFileTreatmentState, MonacoEditor}) => {

    function reinitJSFilters() {
        const reinitValueL = `
try {
    let body = JSON.parse(rawBodyInput);
    // rawBodyOutput can be updated to format data as you need
    rawBodyOutput = JSON.stringify(body);
    // writing "isSkipped=true" will remove the item from the results
    isSkipped=false;
} catch(ex) {
    console.log("Left parsing crash");
    console.log(ex.toString());
    rawBodyOutput = rawBodyInput;
}`;
        const reinitValueR = `
try {
    let body = JSON.parse(rawBodyInput);
    // rawBodyOutput can be updated to format data as you need
    rawBodyOutput = JSON.stringify(body);
    // writing "isSkipped=true" will remove the item from the results
    isSkipped=false;
} catch(ex) {
    console.log("Right parsing crash");
    console.log(ex.toString());
    rawBodyOutput = rawBodyInput;
}`;
        setFileTreatmentState({...fileTreatmentState, scriptEditorLeft: reinitValueL, scriptEditorRight: reinitValueR});
    }

    return <>
        <div className="tabs__container">
            <div className="tabs__function-filter">
                <label>Left filter</label>
                <JsonEditor
                    id="fileTreatment_script_left_editor"
                    language="javascript"
                    value={fileTreatmentState.scriptEditorLeft}
                    onChange={e => setFileTreatmentState({...fileTreatmentState, scriptEditorLeft: e})}
                    MonacoEditor={MonacoEditor}
                />
            </div>
            <div className="tabs__function-filter">
                <label>Right filter</label>
                <JsonEditor
                    id="fileTreatment_script_right_editor"
                    language="javascript"
                    value={fileTreatmentState.scriptEditorRight}
                    onChange={e => setFileTreatmentState({...fileTreatmentState, scriptEditorRight: e})}
                    MonacoEditor={MonacoEditor}
                />
            </div>
        </div>
        <div className="tabs__container">
            <Button onClick={() => reinitJSFilters()}>Reset</Button>
        </div>
    </>;
};

export default ScriptEditorContainer;

import React, {Suspense} from "react";

const Editor = ({id, language, value, onChange, MonacoEditor}) => {

    return <Suspense fallback={<div>Chargement de l'éditeur...</div>}>
        <MonacoEditor
            id={id}
            height={window.screen.height / 2}
            language={language}
            value={value}
            onChange={e => onChange(e)}
            theme="vs-dark"
        />
    </Suspense>;
};

export default Editor;

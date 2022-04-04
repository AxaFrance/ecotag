import React from "react";
import withAuthentication, {DataScientist} from "../../withAuthentication";

const ExportButton = ({user: {roles = []}, onExport, projectId, projectName}) => {

    const exportAnnotations = async e => {
        e.preventDefault();
        const response = await onExport(projectId);
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${projectName}-annotations.json`;
        document.body.appendChild(a);
        a.click();
        a.remove();
    };
    
    return (
        <>
            {roles.includes(DataScientist) ?
                <a className="ft-actionBar__link" onClick={exportAnnotations} href="">Exporter</a>
                : null
            }
        </>
    );
};

export default withAuthentication()(ExportButton);


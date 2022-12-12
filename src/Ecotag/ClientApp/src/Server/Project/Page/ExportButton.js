import React, {useState} from "react";
import {DataScientist} from "../../withAuthentication";

const ExportButton = ({user: {roles = []}, onExport, projectId, projectName}) => {

    const [downloading, setDownloading] = useState(false);

    const exportAnnotations = async e => {
        e.preventDefault();
        if (downloading) {
            return;
        }
        setDownloading(true);
        const response = await onExport(projectId);
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${projectName}-annotations.json`;
        document.body.appendChild(a);
        a.click();
        a.remove();
        setDownloading(false);
    };

    return (
        <>
            {roles.includes(DataScientist) &&
                <a className="ft-actionBar__link" onClick={exportAnnotations} href="">Exporter</a>
            }
        </>
    );
};

export default ExportButton;


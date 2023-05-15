import React, {useState} from "react";
import {DataScientist} from "../../withAuthentication";
import useProjectTranslation from "../../../useProjectTranslation";

const ExportButton = ({user: {roles = []}, onExport, projectId, projectName}) => {

    const [downloading, setDownloading] = useState(false);

    const {translate} = useProjectTranslation();

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
                <a className="ft-actionBar__link" onClick={exportAnnotations} href="">{translate('project.project_page.export_button.label')}</a>
            }
        </>
    );
};

export default ExportButton;


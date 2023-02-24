import React from 'react';
import {useHistory} from 'react-router-dom';
import Button from '@axa-fr/react-toolkit-button';
import './Page.scss';
import ExportButton from "./ExportButton";
import useProjectTranslation from "../../../translations/useProjectTranslation";

export const ActionBar = ({projectId, projectName, isAnnotationClosed, onExport, user}) => {
    const history = useHistory();
    const {translate} = useProjectTranslation();

    const startTaggingButton = () => {
        const path = `/projects/${projectId}/annotations/start`;
        history.push(path);
    };

    if (!projectId) {
        return null;
    }

    return (
        <div className="ft-actionBar">
            {(isAnnotationClosed) ? null : <Button onClick={startTaggingButton} id="startTagging" name={translate('project.project_page.action_bar.start_button_label')}>
                <span className="af-btn-text">{translate('project.project_page.action_bar.start_button_label')}</span>
            </Button>}
            <ExportButton user={user} projectId={projectId} projectName={projectName} onExport={onExport}/>
        </div>
    );
};

export default ActionBar;

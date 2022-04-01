import React from 'react';
import { useHistory } from 'react-router-dom';
import Button from '@axa-fr/react-toolkit-button';
import './Page.scss';

export const ActionBar = ({ projectId, projectName, isAnnotationClosed, onExport }) => {
  const history = useHistory();

  const startTaggingButton = () => {
    const path = `/projects/${projectId}/annotations/start`;
    history.push(path);
  };
  
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
  }
  
  if(!projectId){
    return null;
  }
  
  return (
    <div className="ft-actionBar">
      <div>
        {(isAnnotationClosed) ? null: <Button onClick={startTaggingButton} id="startTagging" name="Start Tagging">
          <span className="af-btn-text">Start Tagging</span>
        </Button>}
        <a onClick={exportAnnotations} href="">Exporter</a>
      </div>
    </div>
  );
};

export default ActionBar;

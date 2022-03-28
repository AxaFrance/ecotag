import React from 'react';
import { useHistory } from 'react-router-dom';

import Button from '@axa-fr/react-toolkit-button';
import './Page.scss';


export const ActionBar = ({ project }) => {
  const history = useHistory();

  const startTaggingButton = () => {
    const path = `/projects/${project.id}/annotations/start`;
    history.push(path);
  };
  
  if(!project){
    return;
  }

  return (
    <div className="ft-actionBar">
      <div>
        {(project.annotationStatus.isAnnotationClosed) ? null: <Button onClick={startTaggingButton} id="startTagging" name="Start Tagging">
          <span className="af-btn-text">Start Tagging</span>
        </Button>}
      </div>
    </div>
  );
};

export default ActionBar;

import React from 'react';
import { useHistory } from 'react-router-dom';

import Button from '@axa-fr/react-toolkit-button';
import './Page.scss';


export const ActionBar = ({ projectId, isAnnotationClosed }) => {
  const history = useHistory();

  const startTaggingButton = () => {
    const path = `/projects/${projectId}/annotations/start`;
    history.push(path);
  };
  
  if(!projectId){
    return null;
  }

  return (
    <div className="ft-actionBar">
      <div>
        {(isAnnotationClosed) ? null: <Button onClick={startTaggingButton} id="startTagging" name="Start Tagging">
          <span className="af-btn-text">Start Tagging</span>
        </Button>}
      </div>
    </div>
  );
};

export default ActionBar;

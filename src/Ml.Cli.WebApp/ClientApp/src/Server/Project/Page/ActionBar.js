import React from 'react';
import { useHistory } from 'react-router-dom';

import Button from '@axa-fr/react-toolkit-button';
import './Page.scss';

const showEditButton = isAdmin => {
  return isAdmin ? (
    <div>
      <Button className="btn af-btn af-btn--success af-btn--hasiconRight" tabIndex="-1">
        <span className="af-btn__text">Edit Project</span>
        <i className="glyphicon glyphicon-pencil"/>
      </Button>
    </div>
  ) : null;
};

export const ActionBar = ({ currentUser, project, dataset }) => {
  const history = useHistory();

  const startTaggingButton = () => {
    const path = `/projects/${project.id}/annotations/${dataset.id}`;
    history.push(path);
  };

  return (
    <div className="ft-actionBar">
      {showEditButton(currentUser.role === 'ADMIN')}
      <div>
        <Button onClick={() => startTaggingButton()} id="startTagging" name="Start Tagging">
          <span className="af-btn-text">Start Tagging</span>
        </Button>
      </div>
    </div>
  );
};

export default ActionBar;

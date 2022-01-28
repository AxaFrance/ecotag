import React from "react";
import Button from '@axa-fr/react-toolkit-button';

const Lock = ({state, onLockDataset}) => {
    const buttonDisabled = state.files.filesSend.length === 0;
    return (
        <div className="edit-dataset__lock-button-container">
            <Button
                id="lock-button"
                classModifier={buttonDisabled || state.dataset.isLock ? 'disabled' : 'danger'}
                onClick={onLockDataset}
                icon="lock"
                disabled={buttonDisabled}>
                <span className="af-btn__text">{state.dataset.isLock ? 'Dataset verrouiller' : "verrouiller"}</span>
                <i className=' edit-dataset__lock-button-icon glyphicon glyphicon-lock' />
            </Button>
        </div>
    );
};

export default Lock;

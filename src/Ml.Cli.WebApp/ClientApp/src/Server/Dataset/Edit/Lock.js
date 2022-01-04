import React from "react";
import Button from '@axa-fr/react-toolkit-button';

const Lock = ({state, setState}) => {
    const buttonDisabled = state.filesSend.length === 0;
    const lockDataset = () => {
        setState({...state, openLockModal: !state.openLockModal});
    };

    return (
        <div className="edit-dataset__lock-button-container">
            <Button
                id="lock-button"
                classModifier={buttonDisabled || state.isLock ? 'disabled' : 'danger'}
                onClick={lockDataset}
                icon="lock"
                disabled={buttonDisabled}>
                <span className="af-btn__text">{state.isLock ? 'Dataset verrouillée' : "verrouillée"}</span>
                <i className=' edit-dataset__lock-button-icon glyphicon glyphicon-lock' />
            </Button>
        </div>
    );
};

export default Lock;

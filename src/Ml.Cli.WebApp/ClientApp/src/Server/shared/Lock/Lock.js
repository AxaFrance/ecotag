import React from "react";
import Button from '@axa-fr/react-toolkit-button';
import './Lock.scss';

const Lock = ({isLocked, isDisabled, text, lockedText, onLockAction}) => {
    return (
        <div className="lock__button-container">
            <Button
                id="lock-button"
                classModifier={isDisabled || isLocked ? 'disabled' : 'danger'}
                onClick={onLockAction}
                icon="lock"
                disabled={isDisabled}>
                <span className="af-btn__text">{isLocked ? lockedText : text}</span>
                <i className='lock__button-icon glyphicon glyphicon-lock' />
            </Button>
        </div>
    );
};

export default Lock;

import React from 'react';
import { GlobalHotKeys } from 'react-hotkeys';
import Toolbar, {ToolbarButtonContainer, ToolbarButton} from '../Toolbar';

const ToolbarContainer = ({ setState, state, onSubmit }) => {

    const onZoomIn = (e) => {
        e.preventDefault();
        setState({ ...state, fontSize: state.fontSize + 1 });
    };

    const onZoomOut = (e) => {
        e.preventDefault();
        setState({ ...state, fontSize: state.fontSize - 1 });
    };

    const keyMap = {
        Submit: 'ctrl+spacebar',
        ZoomIn: 'z',
        ZoomOut: 'o',
    };

    const handlers = {
        Submit: onSubmit,
        ZoomIn: onZoomIn,
        ZoomOut: onZoomOut,
    };
    
    return (
        <GlobalHotKeys allowChanges={true} keyMap={keyMap} handlers={handlers}>
            <Toolbar onSubmit={onSubmit} isSubmitDisabled={!state.mail && state.annotation.classification}>
                <ToolbarButtonContainer>
                    <ToolbarButton title="Raccourci : Z" onClick={onZoomIn} icon="zoom-in" label="Zoom In" />
                    <ToolbarButton title="Raccourci : 0" onClick={onZoomOut} icon="zoom-out" label="Zoom Out" />
                </ToolbarButtonContainer>
            </Toolbar>
        </GlobalHotKeys>
    );
};

export default React.memo(ToolbarContainer);

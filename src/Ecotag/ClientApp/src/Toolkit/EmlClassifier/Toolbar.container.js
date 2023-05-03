import React from 'react';
import {GlobalHotKeys} from 'react-hotkeys';
import Toolbar, {ToolbarButton, ToolbarButtonContainer} from '../Toolbar';
import useProjectTranslation from "../../translations/useProjectTranslation";

const ToolbarContainer = ({setState, state, onSubmit, isSubmitDisabled}) => {

    const {translate} = useProjectTranslation('toolkit');
    const onZoomIn = (e) => {
        e.preventDefault();
        setState({...state, fontSize: state.fontSize + 1});
    };

    const onZoomOut = (e) => {
        e.preventDefault();
        setState({...state, fontSize: state.fontSize - 1});
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
            <Toolbar onSubmit={onSubmit} isSubmitDisabled={isSubmitDisabled}>
                <ToolbarButtonContainer>
                    <ToolbarButton title={translate('eml_classifier.toolbar.zoom_in.title')} onClick={onZoomIn} icon="zoom-in" label={translate('eml_classifier.toolbar.zoom_in.label')}/>
                    <ToolbarButton title={translate('eml_classifier.toolbar.zoom_out.title')} onClick={onZoomOut} icon="zoom-out" label={translate('eml_classifier.toolbar.zoom_out.label')}/>
                </ToolbarButtonContainer>
            </Toolbar>
        </GlobalHotKeys>
    );
};

export default React.memo(ToolbarContainer);

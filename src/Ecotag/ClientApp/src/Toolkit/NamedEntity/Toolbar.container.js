import React from 'react';
import {GlobalHotKeys} from 'react-hotkeys';
import Toolbar, {ToolbarButton, ToolbarButtonContainer, ToolbarSwitchButton} from '../Toolbar';
import useProjectTranslation from "../../translations/useProjectTranslation";

const ToolbarContainer = ({setState, state, onSubmit}) => {

    const {translate} = useProjectTranslation('toolkit');

    const onZoomIn = (e) => {
        e.preventDefault();
        setState({...state, fontSize: state.fontSize + 1});
    };

    const onZoomOut = (e) => {
        e.preventDefault();
        setState({...state, fontSize: state.fontSize - 1});
    };

    const keepLabelsToggle = () => {
        setState({...state, keepLabels: !state.keepLabels});
    }

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
            <Toolbar onSubmit={onSubmit}>
                <ToolbarButtonContainer>
                    <ToolbarSwitchButton
                        id="keepAnnotation"
                        checked={state.keepLabels}
                        onChange={keepLabelsToggle}
                        label={translate('named_entity.toolbar.keep_annotation_label')}
                    />
                </ToolbarButtonContainer>
                <ToolbarButtonContainer>
                    <ToolbarButton title={translate('named_entity.toolbar.zoom_in.title')} onClick={onZoomIn} icon="zoom-in" label={translate('named_entity.toolbar.zoom_in.label')}/>
                    <ToolbarButton title={translate('named_entity.toolbar.zoom_out.title')} onClick={onZoomOut} icon="zoom-out" label={translate('named_entity.toolbar.zoom_out.label')}/>
                </ToolbarButtonContainer>
            </Toolbar>
        </GlobalHotKeys>
    );
};

export default React.memo(ToolbarContainer);

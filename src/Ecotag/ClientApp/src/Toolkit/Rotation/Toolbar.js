import React from 'react';
import {configure, GlobalHotKeys} from 'react-hotkeys';
import Toolbar, {ToolbarButtonContainer, ToolbarProgressButton, ToolbarSwitchButton} from '../Toolbar';

import './Toolbar.scss';
import './ComponentsModifier.scss';
import useProjectTranslation from "../../useProjectTranslation";

configure({ignoreRepeatedEventsWhenKeyHeldDown: false});

const getFileExtension = filename => {
    if (!filename) return '';
    return filename.split('.').pop().split('?')[0];
};

const getImageInfo = imageDimensions => {
    const imageWidth = imageDimensions.width;
    const imageHeight = imageDimensions.height;
    return {
        imageWidth,
        imageHeight,
    };
};

const ToolbarContainer = ({url, state, setState, onSubmit, expectedAngle}) => {
    const {translate} = useProjectTranslation('toolkit');

    const {imageWidth, imageHeight} = getImageInfo(state.imageDimensions);
    const isSubmitDisabled = imageHeight === 0;

    const onSubmitOverride = () => {
        if (isSubmitDisabled) {
            return;
        }
        const data = {
            image_anomaly: state.imageAnomaly,
            width: imageWidth,
            height: imageHeight,
            type: getFileExtension(url),
            labels: {
                angle: parseInt(state.rotate, 10),
            },
        };
        onSubmit(data);
    };

    const onReset = () => setState({...state, rotate: expectedAngle});

    const keyMap = {
        submit: 'ctrl+spacebar',
        reset: 'ctrl+alt+spacebar',
        moveShapeLeft: 'ArrowLeft',
        moveShapeRight: 'ArrowRight',
    };

    const handlers = {
        submit: onSubmitOverride,
        reset: onReset,
        moveShapeLeft: () => {
            if (state.rotate < 180) {
                setState({
                    ...state,
                    rotate: (parseInt(state.rotate, 10) + 1).toString(),
                });
            }
        },
        moveShapeRight: () => {
            if (state.rotate > -179) {
                setState({
                    ...state,
                    rotate: (parseInt(state.rotate, 10) - 1).toString(),
                });
            }
        },
    };

    return (
        <GlobalHotKeys allowChanges={true} keyMap={keyMap} handlers={handlers}>
            <Toolbar
                isSubmitDisabled={isSubmitDisabled}
                onSubmit={onSubmitOverride}
                onReset={onReset}
            >
                <ToolbarButtonContainer classModifier="filters">
                    <ToolbarProgressButton
                        classModifier="width-image"
                        label={translate('rotation.toolbar.progress_label')}
                        id="width-image"
                        value={state.widthImage}
                        onChange={e => setState({...state, widthImage: e.target.value})}
                        type="range"
                        name="width"
                        min="20"
                        max="100"
                    />
                    <ToolbarProgressButton
                        classModifier="opacity"
                        label={translate('rotation.toolbar.opacity_label')}
                        id="opacity"
                        value={state.opacity}
                        onChange={e => setState({...state, opacity: e.target.value})}
                        type="range"
                        name="rotate"
                        step="0.1"
                        min="0"
                        max="1"
                    />
                </ToolbarButtonContainer>
                <ToolbarButtonContainer classModifier="light-grid">
                    <ToolbarSwitchButton
                        id="light-grid"
                        checked={!state.lightGrid}
                        onChange={() => setState({...state, lightGrid: !state.lightGrid})}
                        label={translate('rotation.toolbar.dark_mode_label')}
                    />
                    <ToolbarSwitchButton
                        classModifier="anomaly"
                        id="anomaly"
                        checked={state.imageAnomaly}
                        onChange={() => setState({...state, imageAnomaly: !state.imageAnomaly})}
                        label={translate('rotation.toolbar.anomaly_label')}
                    />
                </ToolbarButtonContainer>
                <ToolbarButtonContainer>
                    <ToolbarProgressButton
                        classModifier="angle"
                        label={`${translate('rotation.toolbar.angle_label')}: ${state.rotate}°`}
                        id="angle"
                        onChange={e => setState({...state, rotate: e.target.value})}
                        value={state.rotate}
                        type="range"
                        step="1"
                        name="rotate"
                        min="-179"
                        max="180"
                    />
                </ToolbarButtonContainer>
            </Toolbar>
        </GlobalHotKeys>
    );
};

export default React.memo(ToolbarContainer);

import React from 'react';
import {GlobalHotKeys} from 'react-hotkeys';
import {ToolbarButton, ToolbarButtonContainer, ToolbarProgressButton, ToolbarSwitchButton} from '../Toolbar';
import useProjectTranslation from "../../useProjectTranslation";

const ToolbarContainer = ({state, setState}) => {
    const {translate} = useProjectTranslation('toolkit');
    const getImageInfo = () => {
        const image = document.getElementById('currentImage');
        const imageWidth = image.width;
        const imageHeight = image.height;
        return {
            imageWidth,
            imageHeight,
        };
    };

    const rotateImage = value => {
        const {imageWidth, imageHeight} = getImageInfo();
        const margin = (Math.max(imageWidth, imageHeight) - Math.min(imageWidth, imageHeight)) / 2;
        const orientation = imageWidth > imageHeight ? 'horizontal' : 'vertical';
        const construcMargin = orientation === 'horizontal' ? `${margin}px -${margin}px` : `-${margin}px ${margin}px`;
        setState({
            ...state,
            marginRotate: construcMargin,
            rotate: value === 'right' ? state.rotate + 90 : state.rotate - 90,
            initialRotate: !state.initialRotate,
        });
    };

    const inlineMode = () => {
        setState({...state, inlineMode: !state.inlineMode});
    };

    const keyMap = {
        Submit: 'ctrl+spacebar',
        RotateLeft: 'l',
        RotateRight: 'r',
        InlineMode: 'i',
    };

    const handlers = {
        RotateRight: () => rotateImage('right'),
        RotateLeft: rotateImage,
        InlineMode: inlineMode,
    };

    return (
        <div className="toolbar">
            <GlobalHotKeys allowChanges={true} keyMap={keyMap} handlers={handlers}>
                <ToolbarButtonContainer classModifier="progress-bar">
                    <ToolbarProgressButton
                        label={translate('image_classifier.toolbar.progress_label')}
                        onChange={e => setState({...state, widthImage: e.target.value})}
                        value={state.widthImage}
                        min="1"
                        max="80"
                    />
                    <ToolbarSwitchButton
                        id="inlineMode"
                        checked={state.inlineMode}
                        onChange={inlineMode}
                        label={translate('image_classifier.toolbar.inline_mode_label')}
                    />
                </ToolbarButtonContainer>
                <ToolbarButtonContainer>
                    <ToolbarButton
                        title={translate('image_classifier.toolbar.rotate_left.title')}
                        onClick={rotateImage}
                        icon="reset"
                        label={translate('image_classifier.toolbar.rotate_left.label')}
                    />
                    <ToolbarButton
                        title={translate('image_classifier.toolbar.rotate_right.title')}
                        onClick={() => rotateImage('right')}
                        icon="repeat"
                        label={translate('image_classifier.toolbar.rotate_right.label')}
                    />
                </ToolbarButtonContainer>
            </GlobalHotKeys>
        </div>
    );
};

export default ToolbarContainer;

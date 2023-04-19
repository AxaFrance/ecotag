import React from 'react';
import {GlobalHotKeys} from 'react-hotkeys';
import Toolbar, {ToolbarButton, ToolbarButtonContainer, ToolbarProgressButton, ToolbarSwitchButton} from '../Toolbar';
import useProjectTranslation from "../../translations/useProjectTranslation";

const getFileExtension = filename => {
    if (!filename) return '';
    return filename.split('.').pop().split('?')[0];
};

const ToolbarContainer = ({state, setState, onSubmit}) => {

    const {translate} = useProjectTranslation('toolkit')

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

    const submitAnnotation = () => {
        const {imageWidth, imageHeight} = getImageInfo();
        const data = {
            width: imageWidth,
            height: imageHeight,
            type: getFileExtension(state.url),
            labels: {...state.userInput},
        };
        onSubmit(data);
        setState({
            ...state,
            userInput: {},
            rotate: 0,
            marginRotate: 0,
            initialRotate: true,
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
        Submit: submitAnnotation,
        RotateRight: () => rotateImage('right'),
        RotateLeft: rotateImage,
        InlineMode: inlineMode,
    };

    return (
        <>
            <GlobalHotKeys allowChanges={true} keyMap={keyMap} handlers={handlers}>
                <Toolbar onSubmit={submitAnnotation}>
                    <ToolbarButtonContainer classModifier="progress-bar">
                        <ToolbarProgressButton
                            label={translate('ocr.toolbar.progress_label')}
                            onChange={e => setState({...state, widthImage: e.target.value})}
                            value={state.widthImage}
                            min="1"
                            max="80"
                        />
                        <ToolbarSwitchButton
                            id="inlineMode"
                            checked={state.inlineMode}
                            onChange={inlineMode}
                            label={translate('ocr.toolbar.inline_mode_label')}
                        />
                    </ToolbarButtonContainer>
                    <ToolbarButtonContainer>
                        <ToolbarButton
                            title={translate('ocr.toolbar.rotation_left.title')}
                            onClick={rotateImage}
                            icon="reset"
                            label={translate('ocr.toolbar.rotation_left.label')}
                        />
                        <ToolbarButton
                            title={translate('ocr.toolbar.rotation_right.title')}
                            onClick={() => rotateImage('right')}
                            icon="repeat"
                            label={translate('ocr.toolbar.rotation_right.label')}
                        />
                    </ToolbarButtonContainer>
                </Toolbar>
            </GlobalHotKeys>
        </>
    );
};

export default ToolbarContainer;

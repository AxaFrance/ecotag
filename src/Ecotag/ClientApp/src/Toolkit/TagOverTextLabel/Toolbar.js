import React from 'react';
import {scaleBy} from '../BoundingBox/Cropping';
import {GlobalHotKeys} from 'react-hotkeys';
import Toolbar, {ToolbarButton, ToolbarButtonContainer} from '../Toolbar';
import useProjectTranslation from "../../useProjectTranslation";

const getFileExtension = filename => {
    if (!filename) return '';
    return filename.split('.').pop().split('?')[0];
};

const ToolbarContainer = ({setState, state, fitImage, onSubmit, image, expectedOutput}) => {
    const {translate} = useProjectTranslation('toolkit');

    const handleSubmit = e => {
        e.preventDefault();
        const inputImageProperties = {
            height: 0,
            width: 0,
        };
        if (image) {
            inputImageProperties.height = image.height;
            inputImageProperties.width = image.width;
        }

        const boundingBoxes = state.labels.map(label => {
            const manual_rectangle = label.manual_rectangle;
            const text_modified = label.manual_rectangle ? true : label.label !== label.defaultLabel;
            const shape = state.shapes.find(s => s.labelId === label.id);
            const expectedElement = label.manual_rectangle
                ? {
                    id: label.id,
                    level: 0,
                    page_num: 0,
                    block_num: 999999,
                    par_num: 0,
                    line_num: 0,
                    word_num: 0,
                    conf: 100,
                    height: Math.round(Math.abs(shape.begin.y - shape.end.y)),
                    left: Math.round(Math.min(shape.begin.x, shape.end.x)),
                    top: Math.round(Math.min(shape.begin.y, shape.end.y)),
                    width: Math.round(Math.abs(shape.begin.x - shape.end.x)),
                }
                : expectedOutput.find(eo => eo.id === label.id);
            return {
                ...expectedElement,
                text_modified,
                manual_rectangle,
                text: label.label,
                label: shape.labelGroupId !== null ? state.labelGroup[shape.labelGroupId].label : '',
                text_default: label.defaultLabel,
            };
        });

        const result = {
            width: inputImageProperties.width,
            height: inputImageProperties.height,
            type: getFileExtension(image.currentSrc),
            labels: {
                boundingBoxes,
            },
        };
        onSubmit(result);
    };

    const onZoomIn = () => {
        setState({...state, stageScale: state.stageScale * scaleBy});
    };

    const onZoomOut = () => {
        setState({...state, stageScale: state.stageScale / scaleBy});
    };

    const handleFitImage = () => {
        setState({...state, ...fitImage()});
    };

    const keyMap = {
        Submit: 'ctrl+spacebar',
        Delete: 'backspace',
        ZoomIn: 'z',
        ZoomOut: 'o',
        FitImage: 'f',
    };

    const handlers = {
        Submit: handleSubmit,
        ZoomIn: onZoomIn,
        ZoomOut: onZoomOut,
        FitImage: handleFitImage,
    };

    return (
        <GlobalHotKeys allowChanges={true} keyMap={keyMap} handlers={handlers}>
            <Toolbar isSubmitDisabled={false} onSubmit={handleSubmit}>
                <ToolbarButtonContainer classModifier="totl">
                    <ToolbarButton
                        title={translate('tag_over_text_label.toolbar.zoom_in.title')}
                        onClick={onZoomIn}
                        icon="zoom-in"
                        label={translate('tag_over_text_label.toolbar.zoom_in.label')}
                    />
                    <ToolbarButton
                        title={translate('tag_over_text_label.toolbar.zoom_out.title')}
                        onClick={onZoomOut}
                        icon="zoom-out"
                        label={translate('tag_over_text_label.toolbar.zoom_out.label')}
                    />
                    <ToolbarButton
                        title={translate('tag_over_text_label.toolbar.fit_image.title')}
                        onClick={handleFitImage}
                        icon="resize-full"
                        label={translate('tag_over_text_label.toolbar.fit_image.label')}
                    />
                </ToolbarButtonContainer>
            </Toolbar>
        </GlobalHotKeys>
    );
};

export default ToolbarContainer;

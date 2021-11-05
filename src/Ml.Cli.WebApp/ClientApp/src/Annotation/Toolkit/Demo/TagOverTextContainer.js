import React, { useEffect, useState } from 'react';
import useImage from 'use-image';
import './TagOverTextContainer.scss';
import TagOverText from "../TagOverText/TagOverText.container";
import cuid from "cuid";

const fitImage = (image, croppingWidth, croppingHeight) => {
    let scaleHeight = 1;
    let scaleWith = 1;
    if (croppingHeight < image.height) {
        scaleHeight = croppingHeight / image.height;
    }
    if (croppingWidth < image.width) {
        scaleWith = croppingWidth / image.width;
    }
    const stageScale = scaleHeight < scaleWith ? scaleHeight : scaleWith;
    return {
        stageScale,
        stageX: 0,
        stageY: 0,
        imageWidth: image.width,
        imageHeight: image.height,
    };
};

const prevStateWithRatioImage = (previousShapes, newImage, previousImageWidth, previousImageHeight) => {
    // Permet a la feature keepAnnotation d'utiliser des ratios plutôt que des données absolues
    const heightRatio = previousImageHeight / newImage.height;
    const widthRatio = previousImageWidth / newImage.width;

    return previousShapes.map(shape => {
        return {
            ...shape,
            begin: {
                x: shape.begin.x / widthRatio,
                y: shape.begin.y / heightRatio,
            },
            end: {
                x: shape.end.x / widthRatio,
                y: shape.end.y / heightRatio,
            },
        };
    });
};

const getFileExtension = filename => {
    if (!filename) return '';
    if (filename.startsWith('data:')) {
        return filename.split(',')[0].split('/')[1].split(';')[0];
    }
    return filename.split('.').pop().split('?')[0];
};

const setAnnotationResult = e => {
    return JSON.stringify({
        width: e.width,
        height: e.height,
        labels: e.labels
    });
}

const CroppingContainer = ({ url, expectedOutput=[] }) => {
    const labelsWithColor = [ {
        id: "1",
        color: 'red'}];
    
    const croppingWidth = (window.innerWidth * 70) / 100 - 100; // -100 correspond au padding 50 50 sur l'annotation-zone
    const croppingHeight = (window.innerHeight * 85) / 100;
    const currentLabelId = labelsWithColor[0].id;
    const initialState = {
        shapes: [],
        color: 'green',
        stageScale: 1,
        stageX: 0,
        stageY: 0,
        isHoverCanvas: false,
        currentLabelId,
        keepAnnotation: false,
        imageHeight: null,
        imageWidth: null,
        onMouseMove: null,
        onMouseDown: false,
        onMoveImage: false,
        onTransform: false,
        onDrag: false,
        rotationDeg: 0,
        croppedUrl: "",
        labels: [],
        annotationResult: ""
    };

    const [state, setState] = useState(initialState);
    const [image] = useImage(url);

    let authorizedCroppingZone = null;
    if(image){
        let max = image.width > image.height ? image.width : image.height;
        authorizedCroppingZone = {
            width: max,
            height:max,
        }
    }

    const strokeWidth = (state) => {

        let max = 0;
        if(image.width > max){
            max = image.width;
        }
        if(image.height > max){
            max = image.height;
        }

        let number = parseInt( max /1000,10);
        if(number === 0){
            number = 1;
        }
        const defaultLineSize = 8;

        return (number * defaultLineSize) / state.stageScale
    }

    useEffect(() => {

        if (image) {
            if (state.keepAnnotation) {
                setState({
                    ...state,
                    currentLabelId,
                    shapes: prevStateWithRatioImage(state.shapes, image, state.imageWidth, state.imageHeight),
                });
            } else {
                const initialShapes = expectedOutput.map(e => {
                    //  const labelId = e.id;
                    const margeWidth = (authorizedCroppingZone.width-image.width)/2;
                    const margeHeight = (authorizedCroppingZone.height-image.height)/2;
                    return {
                        begin: { x: e.left + margeWidth, y: e.top + margeHeight },
                        end: { x: e.left + margeWidth + e.width, y: e.top + margeHeight + e.height },
                        id: cuid(),
                        labelId: currentLabelId,
                        //stroke: getStroke(labelId),
                        //strokeWidth,
                        opacity: 1,
                        stroke: "green",
                        strokeWidth: () => strokeWidth(state) ,
                        focus: false,
                        draggable: true,
                        transformable: true,
                        deletable: false,
                    };
                });
                setState({
                    ...state,
                    ...fitImage(image, croppingWidth, croppingHeight),
                    currentLabelId,
                    shapes: initialShapes,
                });
            }
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [image, expectedOutput]);
    
    useEffect(() => {
        if(image){
            const inputImageProperties = {
                height: 0,
                width: 0,
            };
            if (image) {
                inputImageProperties.height = image.height;
                inputImageProperties.width = image.width;
            }
            const boundingBoxes = state.shapes.map(shape => {
                return {
                    label: labelsWithColor.find(l => l.id === shape.labelId).label,
                    height: Math.round(Math.abs(shape.begin.y - shape.end.y)),
                    left: Math.round(Math.min(shape.begin.x, shape.end.x)-(authorizedCroppingZone.width-image.width)/2),
                    top: Math.round(Math.min(shape.begin.y, shape.end.y)-(authorizedCroppingZone.height-image.height)/2),
                    width: Math.round(Math.abs(shape.begin.x - shape.end.x)) ,
                };
            });
            const result = {
                width: inputImageProperties.width,
                height: inputImageProperties.height,
                angle: -state.rotationDeg,
                type: getFileExtension(image.currentSrc),
                labels: {
                    boundingBoxes,
                },
            };
            /*const flattenedBoxes = flattenBoundingBoxes(result.labels.boundingBoxes);
            const firstBox = flattenedBoxes[0];
            cropImageAsync(window.cv)(url, firstBox.left, firstBox.top, firstBox.width, firstBox.height, result.angle)
                .then(croppedImageBase64 => setState({...state, croppedUrl: croppedImageBase64, labels: flattenedBoxes}));*/
            setState({...state, labels: flattenBoundingBoxes(result.labels.boundingBoxes)});
        }
    }, [state.shapes]);

    const onMouseLeaveCropping = () => {
        setState({ ...state, isHoverCanvas: false, onMoveImage:false });
    };

    const onMouseEnterCropping = () => {
        setState({ ...state, isHoverCanvas: true });
    };
    
    const flattenBoundingBoxes = (boundingBoxes) => {
        const newArray = [];
        boundingBoxes.forEach((boundingBox, index) => {
            newArray.push({
                height: boundingBox.height,
                left: boundingBox.left,
                top: boundingBox.top,
                width: boundingBox.width,
                id: index,
                block_num: 1,
                level: 1,
                page_num: 1,
                par_num: 1,
                line_num: 1,
                word_num: 1,
                conf: 0,
                text: ""
            })
        })
        return newArray;
    };

    return (
        <div className="demo-cropping">
            <div className="demo-cropping__container">
                {state.annotationResult &&
                    <p className="demo-cropping__result">{state.annotationResult}</p>
                }
                <div
                    className="demo-cropping__annotation-zone"
                    onMouseLeave={onMouseLeaveCropping}
                    onMouseEnter={onMouseEnterCropping}>
                    {state.labels.length !== 0 &&
                        <TagOverText
                            expectedOutput={state.labels}
                            url={url}
                            onSubmit={e => setState({...state, annotationResult: setAnnotationResult(e)})}
                        />
                    }
                </div>
            </div>
        </div>
    );
};

export default React.memo(CroppingContainer);

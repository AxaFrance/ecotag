import React, { useEffect } from 'react';
import { Group, Image, Layer, Stage } from 'react-konva';
import Rectangle from './Rectangle';
import { configure, GlobalHotKeys } from 'react-hotkeys';
import cuid from 'cuid';
import classNames from 'classnames';

import './cropping.scss';

export const scaleBy = 1.2;
export const minSize = 10;
configure({ ignoreRepeatedEventsWhenKeyHeldDown: false });

export const isOverShape = (shapes, point) => {
  for (let i = 0; i < shapes.length; i++) {
    const shape = shapes[i];
    if (shape.begin.x <= point.x && point.x <= shape.end.x && shape.begin.y <= point.y && point.y <= shape.end.y) {
      return true;
    }
  }
  return false;
};

const getShapeById = (shapes, id) => shapes.find(shape => shape.id === id);

export const isRectangleCollision = (image, rectangle) => {
  const rect = { x: 0, y: 0, width: image.width, height: image.height };
  return (
    rect.x < rectangle.x + rectangle.width &&
    rect.x + rect.width > rectangle.x &&
    rect.y < rectangle.y + rectangle.height &&
    rect.height + rect.y > rectangle.y
  );
};

const ordonateCoordinates = shapeToOrder => {
  const { begin, end } = shapeToOrder;
  return {
    ...shapeToOrder,
    begin: { x: Math.min(begin.x, end.x), y: Math.min(begin.y, end.y) },
    end: { x: Math.max(begin.x, end.x), y: Math.max(begin.y, end.y) },
  };
};

const cropX = (image, x) => (x > image.width ? image.width : x < 0 ? 0 : x);
const cropY = (image, y) => (y > image.height ? image.height : y < 0 ? 0 : y);

const isSkipUp = (beginY, endY) => {
  return Math.abs(beginY - endY) <= minSize;
};

export const setFocus = (shapes, id, onFocus) => {
  return shapes
    .map(shape => {
      let newShape = { ...shape };
      const focus = shape.id === id;
      newShape.focus = focus;
      if (focus && onFocus) {
        newShape = onFocus(newShape);
      }
      return newShape;
    })
    .sort((a, b) => {
      // permet de replacer le rectangle séléctionner au dessus de la pile
      return b.focus ? -1 : 1;
    });
};

const Cropping = ({ currentLabelId, initShape, moveImageActive=false, image, authorizedCroppingZone=null, state, setState, croppingHeight, croppingWidth, onFocus, classModifier=null }) => {
  if(!authorizedCroppingZone && image){
    authorizedCroppingZone = {
      width: image.width,
      height: image.height,
    }
  }

  const handleWheel = e => {
    e.evt.preventDefault();
    const stage = e.target.getStage();
    const oldScale = stage.scaleX();
    const pointerPosition = stage.getPointerPosition();
    const mousePointTo = {
      x: pointerPosition.x / oldScale - stage.x() / oldScale,
      y: pointerPosition.y / oldScale - stage.y() / oldScale,
    };
    const newScale = e.evt.deltaY > 0 ? oldScale * scaleBy : oldScale / scaleBy;
    stage.scale({ x: newScale, y: newScale });
    setState({
      ...state,
      stageScale: newScale,
      stageX: -(mousePointTo.x - pointerPosition.x / newScale) * newScale,
      stageY: -(mousePointTo.y - pointerPosition.y / newScale) * newScale,
    });
  };

  const handleMoveImage = e => {
    e.evt.preventDefault();
    const stage = e.target.getStage();
    const oldScale = stage.scaleX();
    const pointerPosition = stage.getPointerPosition();
    const { x, y } = getPoint(e);
    setState({
      ...state,
      stageScale: oldScale,
      stageX:  -state.begin.x * oldScale  + pointerPosition.x ,
      stageY:  -state.begin.y * oldScale + pointerPosition.y ,
    });
  };

  const getPoint = e => {
    // Récupération du point en fonction du zoom
    const x = (e.evt.layerX - state.stageX) / state.stageScale;
    const y = (e.evt.layerY - state.stageY) / state.stageScale;
    return { x, y };
  };

  const onMouseMove = e => {
    if(moveImageActive) {
      const { x, y } = getPoint(e);
      const isOverShapeTmp = isOverShape(state.shapes, { x, y });
      if(!isOverShapeTmp) {
        document.body.style.cursor = 'all-scroll';
      }
      if(state.onMoveImage) {
        handleMoveImage(e);
      }
    } else if (state.onMouseDown) {
      const { x, y } = getPoint(e);
      setState({ ...state, onMouseMove: { x, y } });
    } else {
      document.body.style.cursor = '';
    }
    
    
  };

  const onMouseDown = e => {
    const { x, y } = getPoint(e);
    // Création d'une nouvelle figure
    const isOverShapeTmp = isOverShape(state.shapes, { x, y });
    if (!isOverShapeTmp && currentLabelId && !state.onTransform && !moveImageActive) {
      const newShapes = setFocus(state.shapes);
      const newState = {
        ...state,
        shapes: newShapes,
        begin: { x, y },
        onMouseDown: true,
        onMouseMove: { x, y },
      };
      setState(newState);
    } else if(!isOverShapeTmp && moveImageActive){
      const newState = {
        ...state,
        begin: { x, y },
        onMoveImage: true
      };
      setState(newState);
    }
  };

  const onMouseUp = e => {
    const { x, y } = getPoint(e);
    if (state.onMoveImage){
      const newState = {
        ...state,
        onMoveImage: false,
      };
      setState(newState);
    } else if (state.onMouseDown) {
      const beginX = cropX(authorizedCroppingZone, state.begin.x);
      const beginY = cropY(authorizedCroppingZone, state.begin.y);
      const skipUp = isSkipUp(beginX, x) || isSkipUp(beginY, y);
      if (skipUp) {
        const newState = {
          ...state,
          onMouseDown: false,
        };
        setState(newState);
        return;
      }
      const rectangleForCollissionDetection = {
        x: Math.round(Math.min(state.begin.x, x)),
        y: Math.round(Math.min(state.begin.y, y)),
        width: Math.round(Math.abs(state.begin.x - x)),
        height: Math.round(Math.abs(state.begin.y - y)),
      };
      if (isRectangleCollision(authorizedCroppingZone, rectangleForCollissionDetection)) {
        // Creation
        const endX = cropX(authorizedCroppingZone, x);
        const endY = cropY(authorizedCroppingZone, y);

        let { newTempState, newShape } = initShape(
          state,
          ordonateCoordinates({
            begin: { x: beginX, y: beginY },
            end: { x: endX, y: endY },
            id: cuid(),
            labelId: currentLabelId,
            focus: true,
          })
        );
        if (onFocus) {
          newShape = onFocus(newShape);
        }

        const newState = {
          ...newTempState,
          end: { x, y },
          onMouseDown: false,
          shapes: [...state.shapes, newShape],
        };
        setState(newState);
      } else {
        const newState = {
          ...state,
          onMouseDown: false,
        };
        setState(newState);
      }
    }
  };

  const handleDragEnd = e => {
    const { id } = e.currentTarget.attrs;

    const targetX = e.target.x();
    const targetY = e.target.y();
    const targetWidth = Math.abs(e.target.width());
    const targetHeight = Math.abs(e.target.height());

    const targetShapes = state.shapes.filter(shape => shape.id !== id);
    const rectangleForCollissionDetection = {
      x: targetX,
      y: targetY,
      width: targetWidth,
      height: targetHeight,
    };
    if (isRectangleCollision(authorizedCroppingZone, rectangleForCollissionDetection)) {
      // Je supprime l'ancien shape et je recrée un nouveau au bonne coordonnée
      const beginX = cropX(authorizedCroppingZone, targetX);
      const beginY = cropY(authorizedCroppingZone, targetY);
      const endX = cropX(authorizedCroppingZone, targetX + targetWidth);
      const endY = cropY(authorizedCroppingZone, targetY + targetHeight);

      // Si le nouveau rectangle est trop petit on le supprime
      if (isSkipUp(beginY, endY) || isSkipUp(beginX, endX)) {
        setState({ ...state, onDrag: false, shapes: targetShapes });
        document.body.style.cursor = '';
      } else {
        const oldShape = getShapeById(state.shapes, id);
        const newState = {
          ...state,
          onDrag: false,
          shapes: [
            ...targetShapes,
            ordonateCoordinates({
              ...oldShape,
              begin: { x: beginX, y: beginY },
              end: { x: endX, y: endY },
              id: cuid(),
            }),
          ],
        };
        setState(newState);
        document.body.style.cursor = 'grab';
      }
    } else {
      setState({ ...state, onDrag: false, shapes: targetShapes });
      document.body.style.cursor = '';
    }
  };

  const handleDragStart = e => {
    const { id } = e.currentTarget.attrs;
    const shapes = setFocus(state.shapes, id, onFocus);
    document.body.style.cursor = 'grabbing';
    setState({ ...state, onDrag: true, shapes });
  };

  const handleClick = e => {
    const { id } = e.currentTarget.attrs;
    const shapes = setFocus(state.shapes, id, onFocus);
    setState({ ...state, shapes });
  };

  const handleMouseEnter = () => {
    document.body.style.cursor = 'grab';
  };

  const handleMouseLeave = () => {
    document.body.style.cursor = ''
  };

  const handleMouseLeaveState = () => {
    document.body.style.cursor = ''
  };

  const onCustomTransformEnd = e => {
    const { id, x, y, height, width } = e;

    const endX = cropX(authorizedCroppingZone, x + width);
    const endY = cropY(authorizedCroppingZone, y + height);
    const beginX = cropX(authorizedCroppingZone, x);
    const beginY = cropY(authorizedCroppingZone, y);

    const shape = getShapeById(state.shapes, id);

    const isSkipUpY = isSkipUp(beginY, endY);
    const isSkipUpX = isSkipUp(beginX, endX);

    const targetShape = state.shapes.filter(shape => shape.id !== id);

    if (isSkipUpY || isSkipUpX) {
      setState({
        ...state,
        onTransform: false,
        shapes: [
          ...targetShape,
          {
            ...shape,
            id: cuid(),
            begin: {
              x: isSkipUpX && Math.round(beginX) !== Math.round(shape.begin.x) ? endX - minSize : beginX,
              y: isSkipUpY && Math.round(beginY) !== Math.round(shape.begin.y) ? endY - minSize : beginY,
            },
            end: {
              x: isSkipUpX && Math.round(endX) !== Math.round(shape.end.x) ? beginX + minSize : endX,
              y: isSkipUpY && Math.round(endY) !== Math.round(shape.end.y) ? beginY + minSize : endY,
            }, // on vérifie laquel des parties est inférieur à minSize afin de resize que la partie trop petit
          },
        ],
      });
    } else {
      const newState = {
        ...state,
        onTransform: false,
        shapes: [
          ...targetShape,
          ordonateCoordinates({
            ...shape,
            begin: { x: beginX, y: beginY },
            end: { x: endX, y: endY },
            id: cuid(),
          }),
        ],
      };
      setState(newState);
    }
  };

  const onTransformStart = () => {
    setState({ ...state, onTransform: true });
  };

  const moveShapeWithArrowKey = (e, meaning) => {
    e.preventDefault();
    if (state.onMouseDown || state.onTransform || state.onDrag) {
      return;
    }
    const newShapes = state.shapes;
    const behavior = {
      left: {
        operator: 'sub',
        property: 'x',
      },
      down: {
        operator: 'add',
        property: 'y',
      },
      up: {
        operator: 'sub',
        property: 'y',
      },
      right: {
        operator: 'add',
        property: 'x',
      },
    };

    const focusedShape = newShapes.find(shape => shape.focus);
    const notFocusedShapes = newShapes.filter(shape => !shape.focus);
    const property = behavior[meaning].property;
    const operator = behavior[meaning].operator;
    if (focusedShape) {
      const widthOrHeight = property === 'x' ? authorizedCroppingZone.width : authorizedCroppingZone.height;
      if (operator === 'sub') {
        if (focusedShape.begin[property] <= 0 || focusedShape.end[property] <= 0) {
        } else {
          focusedShape.begin[property]--;
          focusedShape.end[property]--;
        }
      } else {
        if (focusedShape.begin[property] >= widthOrHeight || focusedShape.end[property] >= widthOrHeight) {
        } else {
          focusedShape.begin[property]++;
          focusedShape.end[property]++;
        }
      }
      setState({ ...state, shapes: [...notFocusedShapes, focusedShape] });
    }
  };

  const keyMap = {
    moveShapeLeft: 'ArrowLeft',
    moveShapeDown: 'ArrowDown',
    moveShapeUp: 'ArrowUp',
    moveShapeRight: 'ArrowRight',
  };

  const handlers = {
    moveShapeLeft: e => moveShapeWithArrowKey(e, 'left'),
    moveShapeDown: e => moveShapeWithArrowKey(e, 'down'),
    moveShapeUp: e => moveShapeWithArrowKey(e, 'up'),
    moveShapeRight: e => moveShapeWithArrowKey(e, 'right'),
  };

  const createShapeOutsideClick = () => {
    if (state.onMouseDown && !state.isHoverCanvas) {
      if (state.begin.x <= 0 || state.begin.x > authorizedCroppingZone.width || state.begin.y <= 0 || state.begin.y > authorizedCroppingZone.height) {
        const newState = {
          ...state,
          onMouseDown: false,
        };
        setState(newState);
      } else {
        const x = state.onMouseMove.x > authorizedCroppingZone.width ? authorizedCroppingZone.width : state.onMouseMove.x <= 0 ? 0 : state.onMouseMove.x;
        const y =
          state.onMouseMove.y > authorizedCroppingZone.height ? authorizedCroppingZone.height : state.onMouseMove.y <= 0 ? 0 : state.onMouseMove.y;

        const { newTempState, newShape } = initShape(
          state,
          ordonateCoordinates({
            begin: state.begin,
            end: { x, y },
            id: cuid(),
            labelId: currentLabelId,
            focus: true,
          })
        );
        const newState = {
          ...newTempState,
          end: { x, y },
          onMouseDown: false,
          shapes: [...state.shapes, newShape],
        };
        setState(newState);
      }
    }
  };

  useEffect(() => {
    const body = window.document.getElementsByTagName('body')[0];
    if (body) {
      body.addEventListener('mouseup', createShapeOutsideClick);
    }
    return () => {
      if (body) {
        body.removeEventListener('mouseup', createShapeOutsideClick);
      }
    };
  });
  const containerClassName = "konvajs-content__container"
  const className = classNames(containerClassName, {
    [containerClassName+ "--" + classModifier]:classModifier ,
  });
  
  const imageSettings = {
    offsetX:image?(image.width)/2:0,
    offsetY:image?(image.height)/2:0,
    x:image && authorizedCroppingZone?(authorizedCroppingZone.width/2):0,
    y:image && authorizedCroppingZone?(authorizedCroppingZone.height/2):0,
  };

  return (
    <>
      <GlobalHotKeys allowChanges={true} keyMap={keyMap} handlers={handlers}>
        <div className={className}>
          <Stage
            width={croppingWidth}
            height={croppingHeight}
            onWheel={handleWheel}
            scaleX={state.stageScale}
            scaleY={state.stageScale}
            x={state.stageX}
            y={state.stageY}
            onMouseMove={onMouseMove}
            onMouseDown={onMouseDown}
            onMouseLeave={handleMouseLeaveState}
            onMouseUp={onMouseUp}>
            <Layer>
              <Group>
                {authorizedCroppingZone && <Rectangle
                    x={0}
                    y={0}
                    width={authorizedCroppingZone.width}
                    height={authorizedCroppingZone.height}
                    strokeWidth={2 / state.stageScale}
                    stroke="black"
                    fill="darkgrey"
                />}
                <Image image={image} 
                       rotation={state.rotationDeg ? state.rotationDeg: 0}
                       offsetX={imageSettings.offsetX}
                       offsetY={imageSettings.offsetY}
                       x={imageSettings.x}
                       y={imageSettings.y}
                />
                {state.onMouseDown ? (
                  <Rectangle
                    x={state.begin.x}
                    y={state.begin.y}
                    width={state.onMouseMove.x - state.begin.x}
                    height={state.onMouseMove.y - state.begin.y}
                    strokeWidth={2 / state.stageScale}
                    stroke="black"
                  />
                ) : null}
                {state.shapes.map(shape => (
                  <Rectangle
                    draggable={shape.draggable !== undefined ? shape.draggable : true}
                    transformable={shape.transformable !== undefined ? shape.transformable : true}
                    id={shape.id}
                    onDragEnd={handleDragEnd}
                    onDragStart={handleDragStart}
                    onClick={handleClick}
                    onMouseEnter={handleMouseEnter}
                    onMouseLeave={handleMouseLeave}
                    onTransformStart={onTransformStart}
                    onCustomTransformEnd={onCustomTransformEnd}
                    key={shape.id}
                    x={shape.begin.x}
                    y={shape.begin.y}
                    width={shape.end.x - shape.begin.x}
                    height={shape.end.y - shape.begin.y}
                    fill={typeof shape.color === 'function' ? shape.color(state) : shape.color}
                    opacity={shape.opacity ? (typeof shape.stroke === 'function' ? shape.opacity(state): shape.opacity) : 0.4}
                    stroke={shape.stroke ? (typeof shape.stroke === 'function' ? shape.stroke(state) :shape.stroke) : null}
                    strokeWidth={shape.strokeWidth ? (typeof shape.strokeWidth === 'function' ? shape.strokeWidth(state) : shape.strokeWidth ) : null}
                    isSelected={shape.focus}
                  />
                ))}
              </Group>
            </Layer>
          </Stage>
        </div>
      </GlobalHotKeys>
    </>
  );
};

export default React.memo(Cropping);

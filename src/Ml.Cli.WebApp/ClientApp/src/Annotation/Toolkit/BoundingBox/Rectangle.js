import React from 'react';
import { Rect, Transformer } from 'react-konva';

const Rectangle = ({ onCustomTransformEnd, isSelected, transformable, ...otherProps }) => {
  const shapeRef = React.useRef();
  const trRef = React.useRef();
  const isTransformable = isSelected && transformable;

  React.useEffect(() => {
    if (isTransformable) {
      // we need to attach transformer manually
      trRef.current.setNode(shapeRef.current);
      trRef.current.getLayer().batchDraw();
    }
  }, [isTransformable]);

  return (
    <>
      <Rect
        ref={shapeRef}
        {...otherProps}
        onTransformEnd={() => {
          // transformer is changing scale of the node
          // and NOT its width or height
          // but in the store we have only width and height
          // to match the data better we will reset scale on transform end
          const node = shapeRef.current;
          const scaleX = node.scaleX();
          const scaleY = node.scaleY();
          // we will reset it back
          node.scaleX(1);
          node.scaleY(1);

          onCustomTransformEnd({
            id: otherProps.id,
            x: node.x(),
            y: node.y(),
            // set minimal value
            width: node.width() * scaleX,
            height: node.height() * scaleY,
          });
        }}
      />
      {isTransformable && <Transformer keepRatio={false} rotateEnabled={false} ref={trRef} />}
    </>
  );
};

export default Rectangle;

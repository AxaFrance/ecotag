import React, { useEffect, useRef, useState } from 'react';
import Toolbar from './Toolbar.js';
import Cropping from '../BoundingBox/Cropping';
import Labels from './Labels';
import useImage from 'use-image';
import './TagOverText.container.scss';
import '@axa-fr/react-toolkit-core/dist/assets/fonts/icons/af-icons.css';
import cuid from 'cuid';
import './ComponentModifier.scss';

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

const uuidv4 = () => {
  return ([1e7] + -1e3 + -4e3 + -8e3 + -1e11).replace(/[018]/g, c =>
    (c ^ (crypto.getRandomValues(new Uint8Array(1))[0] & (15 >> (c / 4)))).toString(16)
  );
};

const getStroke = labelId => {
  function stroke(state) {
    const label = state.labels.find(l => l.id === labelId);
    if (this.focus) {
      return 'green';
    } else if (label.label === '') {
      return 'orange';
    } else if (label.label !== label.defaultLabel) {
      return label.manual_rectangle ? 'rgb(187,136,254)' : 'blue';
    } else if (label.hasBeenFocused) {
      return 'rgb(14, 198, 254)';
    }
    return 'rgb(180, 180, 180)';
  }
  return stroke;
};

function strokeWidth(state) {
  if (this.focus) {
    return 4 / state.stageScale;
  }
  return 2 / state.stageScale;
}

function opacity() {
  if (this.focus) {
    return 0.5;
  }
  return 1;
}

// On simule la lecture humaine d'une page
const getShapesOrdered = (shapes, orderedShape = [], lineNumber = 0) => {
  const listY = shapes.map(s => s.begin.y);
  const minShapeY = Math.min(...listY);
  const shape = shapes.find(s => s.begin.y === minShapeY);

  const middleY = (shape.begin.y + shape.end.y) / 2;
  const middleHeight = (shape.end.y - shape.begin.y) / 2;
  // On selectionne toutes les shapes qui croisent la ligne et on les trie par x croissant
  let lineShapes = shapes
    .filter(s => {
      if (s.begin.y > middleY - middleHeight && s.end.y < middleY + middleHeight) {
        return true;
      }
      return !(s.begin.y > middleY && middleY < s.end.y);
    })
    .sort((a, b) => {
      return a.begin.x - b.begin.x;
    });

  lineShapes.forEach(ls => orderedShape.push({ shape: ls, lineNumber }));

  const newShapes = shapes.filter(s => !lineShapes.find(ls => ls.id === s.id));
  if (newShapes.length > 0) {
    return getShapesOrdered(newShapes, orderedShape, lineNumber + 1);
  }
  return orderedShape;
};

const getFirstPreviousLabelNonManual = (labels, currentLabelIndex) => {
  for (let i = currentLabelIndex - 1; i >= 0; i--) {
    if (!labels[i].manual_rectangle) {
      return labels[i];
    }
  }
  return null;
};

const getFirstPreviousLabelNonManualBlockNumber = (labels, currentLabelIndex) => {
  const firstPreviousLabelNonManual = getFirstPreviousLabelNonManual(labels, currentLabelIndex);
  return firstPreviousLabelNonManual !== null
    ? firstPreviousLabelNonManual.block_num
    : Math.min(...labels.filter(l => !l.manual_rectangle).map(l => l.block_num));
};

const getFirstNextLabelNonManual = (labels, currentLabelIndex) => {
  for (let i = currentLabelIndex; i < labels.length; i++) {
    if (!labels[i].manual_rectangle) {
      return labels[i];
    }
  }
  return null;
};

const getFirstNextLabelNonManualBlockNumber = (labels, currentLabelIndex) => {
  const firstNextLabelNonManual = getFirstNextLabelNonManual(labels, currentLabelIndex);
  return firstNextLabelNonManual !== null
    ? firstNextLabelNonManual.block_num
    : Math.max(...labels.filter(l => !l.manual_rectangle).map(l => l.block_num));
};

const orderBlockForManualLabels = (shapes, labels) => {
  const orderedShape = getShapesOrdered(shapes, []);

  const orderedLabels = [];
  orderedShape.forEach(os => {
    const label = labels.find(s => os.shape.labelId === s.id);
    orderedLabels.push(label);
  });

  const numberItems = orderedLabels.length;
  const blockLabels = orderedLabels.map((l, index) => {
    let block_num = l.block_num;

    if (l.manual_rectangle) {
      let previousLabel = null;
      let nextLabel = null;

      if (index > 0) {
        previousLabel = orderedLabels[index - 1];
      }
      if (numberItems > index) {
        nextLabel = orderedLabels[index + 1];
      }
      if (nextLabel && previousLabel && nextLabel.block_num !== previousLabel.block_num) {
        const currentShape = orderedShape.find(s => s.shape.labelId === l.id);
        const nextShape = orderedShape.find(s => s.shape.labelId === nextLabel.id);
        const previousShape = orderedShape.find(s => s.shape.labelId === previousLabel.id);

        if (nextShape.lineNumber === previousShape.lineNumber) {
          if (
            Math.abs(nextShape.shape.begin.x - currentShape.shape.end.x) >
            Math.abs(previousShape.shape.end.x - currentShape.shape.begin.x)
          ) {
            block_num = getFirstPreviousLabelNonManualBlockNumber(orderedLabels, index);
          } else {
            block_num = getFirstNextLabelNonManualBlockNumber(orderedLabels, index);
          }
        } else {
          if (
            Math.abs(nextShape.shape.begin.y - currentShape.shape.begin.y) >
            Math.abs(previousShape.shape.begin.y - currentShape.shape.begin.y)
          ) {
            block_num = getFirstPreviousLabelNonManualBlockNumber(orderedLabels, index);
          } else {
            block_num = getFirstNextLabelNonManualBlockNumber(orderedLabels, index);
          }
        }
      } else {
        block_num = getFirstPreviousLabelNonManualBlockNumber(orderedLabels, index);
      }
    }
    return { ...l, index, block_num: block_num };
  });

  return blockLabels;
};

let memoizeData = {
  shapes: '',
  labels: '',
  result: null,
};
const orderBlockForManualLabelsMemoize = (shapes, labels) => {
  // Je choisis de faire un "memoize" custom car je n'arrive pas a rendre la fonction idempotente
  const shapeOrdered = shapes
    .map(s => ({ begin: s.begin, end: s.end, labelId: s.labelId, id: s.id }))
    .sort((a, b) => a.id > b.id);
  const labelsOrdered = labels.map(l => ({
    ...l,
    block_num: l.manual_rectangle ? null : l.block_num,
  }));
  const shapesJson = JSON.stringify(shapeOrdered);
  const labelsJson = JSON.stringify(labelsOrdered);
  if (memoizeData.shapes != shapesJson || memoizeData.labels != labelsJson) {
    memoizeData.shapes = shapesJson;
    memoizeData.labels = labelsJson;
  } else {
    return memoizeData.result;
  }

  const blockLabels = orderBlockForManualLabels(shapeOrdered, labelsOrdered);
  memoizeData.result = blockLabels;
  return blockLabels;
};

const setStateOverride = setState => state => {
  // Gére les suppressions des shapes lorsque l'on sort du cadre
  // Gére le placement des blocs manuel dans les blocs existant
  const labels = orderBlockForManualLabelsMemoize(state.shapes, state.labels);
  return setState({ ...state, labels });
};

const TagOverTextContainer = ({ expectedOutput, url, onSubmit }) => {
  const containerRef = useRef(null);
  const croppingWidth = (window.innerWidth * 70) / 100 - 100; // -100 correspond au padding 50 50 sur l'annotation-zone
  const croppingHeight = (window.innerHeight * 85) / 100;
  const initialState = {
    shapes: [],
    stageScale: 1,
    stageX: 0,
    stageY: 0,
    isHoverCanvas: false,
    imageHeight: null,
    imageWidth: null,
    onMouseMove: null,
    onMouseDown: false,
    onTransform: false,
    onDrag: false,
    enableCreate: false,
    labels: [],
  };

  const [state, setState] = useState(initialState);
  const [image] = useImage(url);

  useEffect(() => {
    /*if (containerRef.current.scrollIntoView) {
      containerRef.current.scrollIntoView({
        block: 'start',
        behavior: 'smooth',
      });
    }*/

    if (image) {
      console.log("expectedOutput: " + JSON.stringify(expectedOutput));
      const labels = expectedOutput.map((label, index) => {
        return {
          id: label.id,
          index: index,
          label: label.text,
          defaultLabel: label.text,
          block_num: label.block_num,
          conf: label.conf,
          manual_rectangle: false,
          hasBeenFocused: false,
        };
      });
      const initialShapes = expectedOutput.map(e => {
        const labelId = e.id;
        return {
          begin: { x: e.left, y: e.top },
          end: { x: e.left + e.width, y: e.top + e.height },
          id: cuid(),
          labelId,
          stroke: getStroke(labelId),
          strokeWidth,
          opacity,
          focus: false,
          draggable: false,
          transformable: false,
          deletable: false,
        };
      });
      setState({
        ...state,
        labels,
        ...fitImage(image, croppingWidth, croppingHeight),
        shapes: initialShapes,
      });
    }
  }, [image, expectedOutput, containerRef.current]);

  const onMouseLeaveCropping = () => {
    setState({ ...state, isHoverCanvas: false });
  };

  const onMouseEnterCropping = () => {
    setState({ ...state, isHoverCanvas: true });
  };

  const initShape = (state, shape) => {
    const labels = state.labels;
    const nextLabelId = shape.labelId;
    const newLabel = {
      id: nextLabelId,
      index: labels.length + 1,
      label: '',
      defaultLabel: '',
      block_num: 999999,
      conf: 100,
      manual_rectangle: true,
      hasBeenFocused: true,
    };
    return {
      newTempState: {
        ...state,
        labels: [...state.labels, newLabel],
      },
      newShape: {
        ...shape,
        color: '',
        stroke: getStroke(nextLabelId),
        strokeWidth,
        opacity,
        deletable: true,
      },
    };
  };

  return (
    <div className="tag-over-text tag-over-text--container-adapter">
      <div className="tag-over-text__container" ref={containerRef}>
        <div
          className="tag-over-text__annotation-zone"
          onMouseLeave={onMouseLeaveCropping}
          onMouseEnter={onMouseEnterCropping}>
          <Cropping
            currentLabelId={state.enableCreate ? uuidv4() : null}
            state={state}
            setState={setStateOverride(setState)}
            croppingWidth={croppingWidth}
            croppingHeight={croppingHeight}
            image={image}
            initShape={state.enableCreate ? initShape : null}
          />
        </div>
        <div className="tag-over-text__labels-list">
          <Labels state={state} setState={setState} croppingHeight={croppingHeight} croppingWidth={croppingWidth} />
        </div>
      </div>
      <Toolbar
        state={state}
        setState={setState}
        fitImage={() => fitImage(image, croppingWidth, croppingHeight)}
        onSubmit={onSubmit}
        image={image}
        expectedOutput={expectedOutput}
      />
    </div>
  );
};

export default React.memo(TagOverTextContainer);

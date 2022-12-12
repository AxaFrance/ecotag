import React from 'react';
import Labels from './Labels';
import classNames from 'classnames';

const defaultClassName = 'ocr-container';
const defaultClassNameLabels = 'ocr-container__labels';

const Ocr = ({state, url, setState}) => {
    const className = classNames(defaultClassName, {
        [`${defaultClassName}--inline-mode`]: state.inlineMode,
    });
    const classNameLabels = classNames(defaultClassNameLabels, {
        [`${defaultClassNameLabels}--inline-mode`]: state.inlineMode,
    });
    return (
        <div className="ocr-container">
            <div className={className} id="imageContainer">
                <img
                    className="ocr-container__image"
                    id="currentImage"
                    src={url}
                    style={{
                        width: `${state.widthImage}%`,
                        height: `${state.widthImage}%`,
                        transform: `rotate(${state.rotate}deg)`,
                        margin: `${state.initialRotate ? '' : state.marginRotate}`,
                    }}
                    alt="Image to Annotate"
                />
                <Labels className={classNameLabels} state={state} setState={setState} labels={state.labels}/>
            </div>
        </div>
    );
};

export default Ocr;

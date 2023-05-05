import React from 'react';
import Labels from './Labels';
import classNames from 'classnames';
import useProjectTranslation from "../../useProjectTranslation";

const defaultClassName = 'ocr-container';
const defaultClassNameLabels = 'ocr-container__labels';

const Ocr = ({state, url, setState}) => {
    const {translate} = useProjectTranslation('toolkit');
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
                    alt={translate('ocr.alt_image')}
                />
                <Labels className={classNameLabels} state={state} setState={setState} labels={state.labels}/>
            </div>
        </div>
    );
};

export default Ocr;

import React from 'react';
import { setLabelsColor } from './labelColor';
import './Label.scss';

const Label = ({labels, selectLabel, selectedLabel}) => {
    const coloredLabels = setLabelsColor(labels);
    return(
        <div className="label__container">
            {coloredLabels.map((label, index) => {
                const { id, name, color } = label;
                return (
                    <span key={id + index} onClick={() => selectLabel(label)}>
                      <label
                          className="label__element"
                          style={selectedLabel.id === id ? {color, backgroundColor: '#4b4848' } : {backgroundColor: color}}
                          htmlFor={name}>
                        {name}
                      </label>
                    </span>
                );
            })}
        </div>
    )
}

export default Label;

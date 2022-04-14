import React from 'react';
import { setLabelsColor } from './labelColor';
import './Label.scss';
import {adaptTextColorToBackgroundColor} from '../colors';

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
                          style={selectedLabel.id === id ? {color: adaptTextColorToBackgroundColor(color), backgroundColor: color, boxShadow: `0 0 0 2px ${color} inset, 0 0 0 4px ${adaptTextColorToBackgroundColor(color)} inset` } : {color: adaptTextColorToBackgroundColor(color), backgroundColor: color}}
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

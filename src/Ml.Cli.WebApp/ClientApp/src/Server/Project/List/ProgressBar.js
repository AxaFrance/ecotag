import React from "react";
import "./ProgressBar.scss";

export const ProgressBar = ({percentage, label}) => (
    <>
        <p data-value={percentage}>{label}</p>
        <progress max="100" value={percentage} className="node-js">
            <div className="progress-bar">
                <span style={{"width": `${percentage}%`}}>{percentage}%</span>
            </div>
        </progress>
    </>
);
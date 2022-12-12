import * as React from 'react';
import {useState} from 'react';
import {adaptTextColorToBackgroundColor} from "../colors";
import './Mark.scss';

const Mark = ({content, start, end, onClick, label, keepLabels}) => {

    const [state, setState] = useState({
        displayCloseButton: false
    });

    const mouseEnter = () => {
        setState({displayCloseButton: true});
    };
    const mouseLeave = () => {
        setState({displayCloseButton: false});
    };

    if (content && content[0] === ' ' && content.length === 1) {
        return null;
    }

    return (
        <mark
            className="token-mark"
            style={{color: adaptTextColorToBackgroundColor(label.color), backgroundColor: label.color}}
            data-start={start}
            data-end={end}
            onClick={() => onClick({start, end})}
            onMouseEnter={mouseEnter}
            onMouseLeave={mouseLeave}>
            {keepLabels ? (
                <span className="token-mark__tag" style={{color: adaptTextColorToBackgroundColor(label.color)}}>
                  {label.name}
                    {state.displayCloseButton && <span className="token-mark__close-button">×</span>}
                </span>
            ) : (
                <>
                    {state.displayCloseButton &&
                        <span className="token-mark__tag" style={{color: adaptTextColorToBackgroundColor(label.color)}}>
                      {label.name}
                            <span className="token-mark__close-button">×</span>
                      </span>
                    }
                </>
            )}
            {content.map((element, key) => (
                <span key={key} className="token-mark__text">
                {element}
              </span>
            ))}
        </mark>
    )
};

export default Mark;

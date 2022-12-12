import React from 'react';
import Mark from './Mark';
import {generateTextToken, getSubToken, selectionIsBackwards, selectionIsEmpty, splitTokensWithOffsets,} from './utils';
import './TokenAnnotator.scss';

const Token = props => {
    const {i, mark, content, onClickHandler} = props;
    if (mark) {
        return <Mark {...props} onClick={onClickHandler}/>;
    } else {
        return (
            <span key={i} className="c0132" data-i={i}>
        {content}
      </span>
        );
    }
};

const TokenAnnotator = ({
                            text,
                            fontSize,
                            tokenIndex,
                            tokenIndexLast,
                            tokenData,
                            getSpan,
                            onChange,
                            value,
                            keepLabels
                        }) => {

    const handleMouseUp = () => {
        if (!onChange) {
            return;
        }

        const selection = window.getSelection();

        if (selectionIsEmpty(selection)) {
            return;
        }

        if (
            !selection.anchorNode.parentElement.hasAttribute('data-i') ||
            !selection.focusNode.parentElement.hasAttribute('data-i')
        ) {
            window.getSelection().empty();
            return false;
        }

        let startIndex = parseInt(selection.anchorNode.parentElement.getAttribute('data-i'), 10);
        let endIndex = parseInt(selection.focusNode.parentElement.getAttribute('data-i'), 10);

        if (selectionIsBackwards(selection)) {
            [startIndex, endIndex] = [endIndex, startIndex];
        }

        const start = tokenIndex[startIndex];
        const end = tokenIndexLast[endIndex];
        const {subText: token} = getSubToken(text, start, end);

        onChange([
            ...value,
            getLocalSpan({
                start,
                end,
                token,
            }),
        ]);

        window.getSelection().empty();
    };

    const handleSplitClick = handleParams => {
        const {start, end} = handleParams;
        // Find and remove the matching split.
        const splitIndex = value.findIndex(s => s.start === start && s.end === end);

        if (splitIndex >= 0) {
            onChange([...value.slice(0, splitIndex), ...value.slice(splitIndex + 1)]);
        }
    };

    const getLocalSpan = span => {
        if (getSpan) {
            return getSpan(span);
        }
        return span;
    };

    const splits = splitTokensWithOffsets({text, tokenData, tokenIndex, tokenIndexLast}, value);

    return (
        <>
            <div className="token-container" style={{fontSize: fontSize}} onMouseUp={handleMouseUp}>
                {splits.map((split, i) => (
                    <Token key={i} {...split} onClickHandler={handleSplitClick} keepLabels={keepLabels}/>
                ))}
            </div>
        </>
    )
}

const TextAnnotation = ({text, fontSize, getSpan, onChange, value, keepLabels}) => {
    const {tokenData, tokenIndex, tokenIndexLast} = generateTextToken(text);
    return <TokenAnnotator
        text={text}
        fontSize={fontSize}
        tokenData={tokenData}
        tokenIndex={tokenIndex}
        tokenIndexLast={tokenIndexLast}
        getSpan={getSpan}
        onChange={onChange}
        value={value}
        keepLabels={keepLabels}
    />;
};

export default TextAnnotation;

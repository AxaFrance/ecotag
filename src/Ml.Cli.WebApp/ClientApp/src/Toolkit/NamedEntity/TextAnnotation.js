import React from 'react';
import Mark from './Mark';
import {
  selectionIsEmpty,
  selectionIsBackwards,
  splitTokensWithOffsets,
  generateTextToken,
  getSubToken,
} from './utils';
import Action from '@axa-fr/react-toolkit-action';
import './TokenAnnotator.scss';

const Token = props => {
  const { i, mark, content, onClickHandler } = props;
  if (mark) {
    return <Mark {...props} onClick={onClickHandler} />;
  } else {
    return (
      <span key={i} className="c0132" data-i={i}>
        {content}
      </span>
    );
  }
};

const TokenAnnotator = class TokenAnnotator extends React.Component {
  constructor(props) {
    super(props);
    this.rootRef = React.createRef();
    this.state = {
      fontSize: 14,
    };
  }

  zoomText() {
    const newValue = this.state.fontSize + 1;
    this.setState({ fontSize: newValue });
  }

  deZoomText() {
    const newValue = this.state.fontSize - 1;
    this.setState({ fontSize: newValue });
  }

  componentDidMount() {
    this.rootRef.current.addEventListener('mouseup', this.handleMouseUp);
  }

  componentWillUnmount() {
    this.rootRef.current.removeEventListener('mouseup', this.handleMouseUp);
  }

  handleMouseUp = () => {
    if (!this.props.onChange) {
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

    const { tokenIndex, tokenIndexLast, text } = this.props;

    if (selectionIsBackwards(selection)) {
      [startIndex, endIndex] = [endIndex, startIndex];
    }

    const start = tokenIndex[startIndex];
    const end = tokenIndexLast[endIndex];
    const { subText: token } = getSubToken(text, start, end);

    this.props.onChange([
      ...this.props.value,
      this.getSpan({
        start,
        end,
        token,
      }),
    ]);

    window.getSelection().empty();
  };

  handleSplitClick = handleParams => {
    const { start, end } = handleParams;
    const { value, onChange } = this.props;
    // Find and remove the matching split.
    const splitIndex = value.findIndex(s => s.start === start && s.end === end);

    if (splitIndex >= 0) {
      onChange([...value.slice(0, splitIndex), ...value.slice(splitIndex + 1)]);
    }
  };

  getSpan = span => {
    if (this.props.getSpan) {
      return this.props.getSpan(span);
    }
    return span;
  };

  render() {
    const { tokenData, tokenIndex, tokenIndexLast, text, value } = this.props;
    const splits = splitTokensWithOffsets({ text, tokenData, tokenIndex, tokenIndexLast }, value);

    return (
      <>
        <div className="zoom-button-container">
          <Action icon="zoom-out" onClick={() => this.deZoomText()} />
          <Action icon="zoom-in" onClick={() => this.zoomText()} />
        </div>
        <div className="token-container" style={{ fontSize: this.state.fontSize }} ref={this.rootRef}>
          {splits.map((split, i) => (
            <Token key={i} {...split} onClickHandler={this.handleSplitClick} />
          ))}
        </div>
      </>
    );
  }
};

const TextAnnotation = props => {
  const { text } = props;
  const { tokenData, tokenIndex, tokenIndexLast } = generateTextToken(text);
  return <TokenAnnotator {...props} tokenData={tokenData} tokenIndex={tokenIndex} tokenIndexLast={tokenIndexLast} />;
};

export default TextAnnotation;

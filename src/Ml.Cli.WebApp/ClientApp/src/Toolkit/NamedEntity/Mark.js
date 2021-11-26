import * as React from 'react';
import { Component } from 'react';

const styles = {
  mark: background => ({
    color: 'inherit',
    margin: '0 3px',
    display: 'inline',
    padding: '5px 8px',
    background,
    fontWeight: 'bold',
    lineHeight: '1',
    cursor: 'pointer',
    position: 'relative',
    WebkitBoxDecorationBreak: 'clone',
  }),
  tag: color => ({
    color,
    fontSize: '16px',
    fontWeight: 'bold',
    fontFamily: '"Roboto Condensed", "Arial Narrow", sans-serif',
    marginLeft: '8px',
    textTransform: 'uppercase',
    verticalAlign: 'middle',
  }),
  x: {
    top: '-9px',
    left: '-9px',
    color: '#fff',
    width: '18px',
    height: '18px',
    display: 'block',
    opacity: '1',
    position: 'absolute',
    fontSize: '0.95em',
    transition: 'opacity 0.1s ease',
    background: '#444',
    textAlign: 'center',
    lineHeight: '1.1',
    fontFamily: 'sans-serif',
    borderRadius: '50%',
  },
  c0132: {
    margin: '0 2px',
    display: 'inline-block',
  },
};

class Mark extends Component {
  state = { displayX: false };
  mouseEnter = () => {
    this.setState({ displayX: true });
  };
  mouseLeave = () => {
    this.setState({ displayX: false });
  };
  render() {
    const { content, start, end, onClick, label } = this.props;
    const { displayX } = this.state;
    if (content && content[0] === ' ' && content.length === 1) {
      return null;
    }
    const color = (label && label.color) || '#ffe184';
    const tagNameColor = '#583fcf';
    return (
      <mark
        style={styles.mark(color)}
        data-start={start}
        data-end={end}
        onClick={() => onClick({ start, end })}
        onMouseEnter={this.mouseEnter}
        onMouseLeave={this.mouseLeave}>
        {content.map((element, key) => (
          <span key={key} style={styles.c0132}>
            {element}
          </span>
        ))}
        {label && (
          <span style={styles.tag(tagNameColor)}>
            {label.name}
            {displayX && <span style={styles.x}>×</span>}
          </span>
        )}
      </mark>
    );
  }
}

export default Mark;

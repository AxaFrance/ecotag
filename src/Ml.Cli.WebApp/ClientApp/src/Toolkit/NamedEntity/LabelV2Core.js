import React, { Component } from 'react';
import { setLabelsColor } from './labelColor';
const styles = {
  c0128: {
    width: '100%',
  },
  c0138: {
    display: 'flex',
    width: '100%',
    color: '#fff',
    padding: '15px 20px',
    fontSize: '20px',
    textAlign: 'center',
    boxSizing: 'border-box',
    fontWeight: 'bold',
    fontFamily: '"Roboto Condensed", "Arial Narrow", sans-serif',
    textTransform: 'uppercase',
    borderTopLeftRadius: '0',
    borderTopRightRadius: '0',
  },
  c0139: { display: 'flex', flexWrap: 'wrap' },
  c0140: background => ({
    margin: '5px 10px 5px 0',
    border: '1px solid',
    cursor: 'pointer',
    fontSize: '25px',
    padding: '1px 10px',
    position: 'relative',
    borderRadius: '5px',
    color: '#4b4848',
    background,
  }),
  c0142: { fontSize: '12.5px', marginLeft: '7px' },
  c0141: color => ({ color, background: '#4b4848' }),
};

class Label extends Component {
  state = {
    selected: 0,
  };
  hot_keys = {};

  selectLabelLocal = label => {
    const { selectLabel } = this.props;
    const { id } = label;
    this.setState({
      selected: id,
      label: {
        ...label,
      },
    });
    if (selectLabel) {
      selectLabel({
        ...label,
      });
    }
  };

  render() {
    let { labels } = this.props;
    const { selected } = this.state;
    labels = setLabelsColor(labels);
    return (
      <div style={styles.c0128}>
        <div style={styles.c0138}>
          <div style={styles.c0139}>
            {labels.map((label, index) => {
              const { id, name, color } = label;
              return (
                <span key={id + index} onClick={() => this.selectLabelLocal(label)}>
                  <label
                    style={selected === id ? { ...styles.c0140(color), ...styles.c0141(color) } : styles.c0140(color)}
                    htmlFor={name}>
                    {name}
                  </label>
                </span>
              );
            })}
          </div>
        </div>
      </div>
    );
  }
}

export default Label;

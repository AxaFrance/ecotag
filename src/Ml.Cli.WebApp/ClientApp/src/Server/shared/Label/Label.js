import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Input, InputConstants as Constants, withInput } from '@axa-fr/react-toolkit-form-core';
import cuid from 'cuid';
import stringToRGB from './stringToRgb';
import './Label.scss';

const LabelContainer = ({ values, onChange, name, id }) => {
  const [inputValue, setInputValue] = useState('');
  const showDelete = false;

  return (
    <NewLabel
      name={name}
      id={id}
      inputValue={inputValue}
      labels={values}
      setLabels={onChange}
      setInputValue={setInputValue}
      showDelete={showDelete}
    />
  );
};

const EditForm = ({ label, setLabels, labelList, setShowEditForm, showEditForm }) => {
  const [valueInput, setValueInput] = useState(label.name);

  const handleSubmit = e => {
    e.preventDefault();
    for (let i = 0; i < labelList.length; i++) {
      if (label.id === labelList[i].id) {
        labelList[i].name = valueInput;
        setLabels(labelList);
      }
    }
    setShowEditForm(!showEditForm);
  };

  const changeLabelColor = value => {
    for (let i = 0; i < labelList.length; i++) {
      if (label.id === labelList[i].id) {
        labelList[i].color = value;
        setLabels(labelList);
      }
    }
  };

  return (
    <>
      <form onSubmit={handleSubmit}>
        <span>
          <i className="glyphicon glyphicon-tint ft-label__color-glyph"/>
          <input
            className="ft-label__input-color"
            onChange={e => changeLabelColor(e.target.value)}
            value={label.color}
            type="color"
          />
        </span>
        <input onChange={e => setValueInput(e.target.value)} value={valueInput} type="text" />
      </form>
      <button onClick={e => handleSubmit(e)} type="submit" id="validateLabelButton" className="af-btn--circle" disabled={!valueInput}>
        <i className="glyphicon glyphicon-ok"/>
      </button>
    </>
  );
};

const LabelOrEditForm = ({label, setLabels, labels, setShowEditForm, showEditForm}) => {
  if (showEditForm === label.id) {
    return (
        <EditForm
            label={label}
            setLabels={setLabels}
            labelList={labels}
            setShowEditForm={setShowEditForm}
            showEditForm={showEditForm}
        />
    );
  } else {
    return (
        <button
            onClick={() => {
              setShowEditForm(label.id);
            }}>
          {label.name}
        </button>
    );
  }
};

const LabelList = ({ labels, remove, showDelete, setLabels }) => {
  const [showEditForm, setShowEditForm] = useState(false);
  
  const editLabel = (e, label) => {
    e.preventDefault();
    setShowEditForm(label.id);
  };

  return labels.map((label, index) => (
    <div key={index} className="ft-label__label-container">
      <div style={{ backgroundColor: label.color }} className="ft-label__label">
        <LabelOrEditForm label={label} setLabels={setLabels} labels={labels} setShowEditForm={setShowEditForm} showEditForm={showEditForm} />
      </div>
      <div className="ft-label__side-button-container">
        <button
          onClick={e => remove(e, index)}
          style={showDelete ? { display: 'none' } : {}}
          className="ft-label__side-button ft-label__side-button--delete">
          <i className="glyphicon glyphicon-trash"/>
        </button>
        <button
          onClick={e => editLabel(e, label)}
          style={showDelete ? { marginLeft: '10px' } : {}}
          className="ft-label__side-button ft-label__side-button--edit">
          <i className="glyphicon glyphicon-pencil"/>
        </button>
      </div>
    </div>
  ));
};

const NewLabel = ({ setInputValue, inputValue, setLabels, labels, showDelete }) => {
  const handleSubmit = e => {
    e.preventDefault();
    if (inputValue === '') {
      return alert('Pas de label');
    }
    setLabels([
      ...labels,
      {
        name: inputValue,
        id: cuid(),
        color: `#${stringToRGB(inputValue + cuid())}`,
      },
    ]);
    setInputValue('');
  };

  const removeLabel = (e, index) => {
    e.preventDefault();
    const newArr = labels.slice();
    newArr.splice(index, 1);
    setLabels(newArr);
  };

  return (
    <div className="ft-label">
      <div className="ft-label__create-form">
        <input
          className="af-form__input-text"
          type="text"
          value={inputValue}
          onChange={e => setInputValue(e.target.value)}
        />
      </div>
      <div className="ft-label__validate-button">
        <button onClick={handleSubmit} type="submit" className="af-btn--circle ft-label__validate-button" disabled={!inputValue}>
          <i className="glyphicon glyphicon-plus" />
        </button>
      </div>
      <div className="ft-label__label-list">
        <LabelList setLabels={setLabels} showDelete={showDelete} labels={labels} remove={removeLabel} />
      </div>
    </div>
  );
};

const propTypes = {
  // eslint-disable-next-line react/forbid-foreign-prop-types
  ...Constants.propTypes,
  values: PropTypes.array,
};
const defaultClassName = 'react-select';

const defaultProps = {
  // eslint-disable-next-line react/forbid-foreign-prop-types
  ...Constants.defaultProps,
  values: null,
  className: defaultClassName,
};

const handlers = {
  onChange: ({ name, id, onChange }) => newValues => {
    onChange({
      values: newValues,
      name,
      id,
    });
  },
};

const EnhancedComponent = withInput(defaultClassName, propTypes, defaultProps, handlers)(LabelContainer);

EnhancedComponent.Clone = Input.Clone;
EnhancedComponent.displayName = LabelContainer.name;

export default EnhancedComponent;

import React from 'react';
import PropTypes from 'prop-types';

import {
  Field,
  FieldConstants as Constants,
  FieldInput,
  HelpMessage,
  FormClassManager,
} from '@axa-fr/react-toolkit-form-core';
import { InputManager } from '@axa-fr/react-toolkit-core';

import LabelContainer from './Label.js';

const propTypes = {
  ...Constants.propTypes,
  value: PropTypes.string,
  values: PropTypes.array,
  placeholder: PropTypes.string,
  loadingPlaceholder: PropTypes.string,
  searchPromptText: PropTypes.string,
  noResultsText: PropTypes.string,
  loadOptions: PropTypes.func,
};

const defaultProps = {
  ...Constants.defaultProps,
  value: '',
};

const LabelInput = props => {
  const {
    classModifier,
    message,
    children,
    helpMessage,
    id,
    disabled,
    classNameContainerLabel,
    classNameContainerInput,
    label,
    name,
    messageType,
    isVisible,
    forceDisplayMessage,
    className,
    value,
    values,
    options,
    placeholder,
    onChange,
    readOnly,
  } = props;
  const inputClassModifier = FormClassManager.getInputClassModifier(classModifier, children);
  const inputFieldClassModifier = FormClassManager.getFieldInputClassModifier(classModifier, disabled);
  const inputId = InputManager.getInputId(id);
  return (
    <Field
      label={label}
      name={name}
      id={inputId}
      message={message}
      messageType={messageType}
      isVisible={isVisible}
      forceDisplayMessage={forceDisplayMessage}
      className={className}
      classModifier={classModifier}
      classNameContainerLabel={classNameContainerLabel}
      classNameContainerInput={classNameContainerInput}>
      <FieldInput
        helpMessage={helpMessage}
        message={message}
        messageType={messageType}
        className="af-form__select"
        classModifier={inputFieldClassModifier}>
        <LabelContainer
          name={name}
          id={inputId}
          value={value}
          values={values}
          options={options}
          placeholder={placeholder}
          onChange={onChange}
          readOnly={readOnly}
          disabled={disabled}
          classModifier={inputClassModifier}
        />
        {children}
      </FieldInput>
      <HelpMessage message={helpMessage} isVisible={!message} />
    </Field>
  );
};

LabelInput.propTypes = propTypes;
LabelInput.defaultProps = defaultProps;

export default LabelInput;

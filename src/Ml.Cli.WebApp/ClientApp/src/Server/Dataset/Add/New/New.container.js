import New from './New';
import { rules } from './New.validation.rules';
import React, { useReducer } from 'react';
import { withRouter } from 'react-router-dom';
import { computeInitialStateErrorMessage, genericHandleChange } from '../../../validation.generic';
import { NAME, TYPE, CLASSIFICATION, FILES, MSG_REQUIRED } from './constants';

const errorList = fields => Object.keys(fields).filter(key => setErrorMessage(key)(fields));

const setErrorMessage = key => fields => fields[key].message !== null;

const preInitState = {
  hasSubmit: false,
  fields: {
    [NAME]: { name: NAME, value: '', message: MSG_REQUIRED },
    [TYPE]: { name: TYPE, value: '', message: MSG_REQUIRED },
    [CLASSIFICATION]: {
      name: CLASSIFICATION,
      value: '',
      message: MSG_REQUIRED,
    },
    [FILES]: { name: FILES, values: [], message: null },
  },
};

export const initState = computeInitialStateErrorMessage(preInitState, rules);

const reducer = (state, action) => {
  switch (action.type) {
    case 'onChange': {
      const newField = genericHandleChange(rules, state.fields, action.event);
      return {
        ...state,
        fields: newField,
      };
    }
    case 'onSubmit': {
      return {
        ...state,
        hasSubmit: true,
      };
    }
    default:
      throw new Error();
  }
};

const useNew = history => {
  const [state, dispatch] = useReducer(reducer, initState);
  const onChange = event => dispatch({ type: 'onChange', event });
  const onSubmit = () => {
    const errors = errorList(state.fields);
    if (!errors.length) {
      history.push('/datasets/confirm');
    }
    dispatch({ type: 'onSubmit' });
  };
  return { state, onChange, onSubmit };
};

const NewContainer = ({ history }) => {
  const { state, onChange, onSubmit } = useNew(history);
  return <New {...state} onChange={onChange} onSubmit={onSubmit} />;
};

export default withRouter(NewContainer);

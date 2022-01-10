import New from './New';
import { rules } from './New.validation.rules';
import { withRouter } from 'react-router-dom';
import { computeInitialStateErrorMessage, genericHandleChange } from '../../../validation.generic';
import {NAME, TYPE, CLASSIFICATION, FILES, MSG_REQUIRED, MSG_DATASET_NAME_ALREADY_EXIST} from './constants';
import React, { useReducer } from 'react';
import {fetchDatasets} from "../../../Project/Add/New/New.service";
import {resilienceStatus, withResilience} from "../../../shared/Resilience";
import {convertStringDateToDateObject} from "../../../date";
import withCustomFetch from "../../../withCustomFetch";
import compose from "../../../compose";

const errorList = fields => Object.keys(fields).filter(key => setErrorMessage(key)(fields));

const setErrorMessage = key => fields => fields[key].message !== null;

const preInitState = {
  hasSubmit: false,
  status: resilienceStatus.LOADING,
  datasets : [],
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
    case 'init':{
        const { datasets, status } = action.data;
        return {
          ...state,
          status,
          datasets
        };
      }
    case 'onChange': {
      const event = action.event;
      let newField = genericHandleChange(rules, state.fields, event);
      const name = event.name
      if(NAME === name){
        if(state.datasets.find(dataset => dataset.name === event.value)) {
          newField = {
            ...newField,
            [name]: {
              ...newField[name],
              message: MSG_DATASET_NAME_ALREADY_EXIST
            }};
        }
      }
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

export const init = (fetch, dispatch) => async () => {
  const response = await fetchDatasets(fetch)();
  let data;
  if(response.status >= 500) {
    data = { datasets: [], status: resilienceStatus.ERROR };
  } else {
    const items = await response.json()
    data = { datasets: convertStringDateToDateObject(items), status: resilienceStatus.SUCCESS };
  }
  dispatch( {type: 'init', data});
};

const useNew = (history, fetch) => {
  const [state, dispatch] = useReducer(reducer, initState);
  const onChange = event => dispatch({ type: 'onChange', event });
  const onSubmit = () => {
    const errors = errorList(state.fields);
    if (!errors.length) {
      history.push('/datasets/confirm');
    }
    dispatch({ type: 'onSubmit' });
  };

  React.useEffect(() => {
    init(fetch, dispatch)();
  }, []);
  
  return { state, onChange, onSubmit };
};

const NewWithResilience = withResilience(New);

const NewContainer = ({ history, fetch }) => {
  const { state, onChange, onSubmit } = useNew(history, fetch);
  return <NewWithResilience {...state} onChange={onChange} onSubmit={onSubmit} />;
};
const enhance = compose(withCustomFetch(fetch), withRouter);
export default  enhance(NewContainer);

import New from './New';
import { rules } from './New.validation.rules';
import { withRouter } from 'react-router-dom';
import { computeInitialStateErrorMessage, genericHandleChange } from '../../../validation.generic';
import {NAME, TYPE, CLASSIFICATION, GROUP, MSG_REQUIRED, MSG_DATASET_NAME_ALREADY_EXIST} from './constants';
import React, { useReducer } from 'react';
import {fetchCreateDataset, fetchDatasets} from "../../Dataset.service";
import {resilienceStatus, withResilience} from "../../../shared/Resilience";
import withCustomFetch from "../../../withCustomFetch";
import compose from "../../../compose";
import {fetchGroups} from "../../../Group/Group.service";

const errorList = fields => Object.keys(fields).filter(key => setErrorMessage(key)(fields));

const setErrorMessage = key => fields => fields[key].message !== null;

const preInitState = {
  hasSubmit: false,
  status: resilienceStatus.LOADING,
  groups : [],
  datasets : [],
  fields: {
    [NAME]: { name: NAME, value: '', message: MSG_REQUIRED },
    [GROUP]: { name: GROUP, value: '', message: MSG_REQUIRED },
    [TYPE]: { name: TYPE, value: '', message: MSG_REQUIRED },
    [CLASSIFICATION]: {
      name: CLASSIFICATION,
      value: '',
      message: MSG_REQUIRED,
    }
  },
};

export const initState = computeInitialStateErrorMessage(preInitState, rules);

const reducer = (state, action) => {
  switch (action.type) {
    case 'init':{
        const { datasets, groups, status } = action.data;
        return {
          ...state,
          status,
          datasets,
          groups
        };
      }
    case 'onChange': {
      const event = action.event;
      let newField = genericHandleChange(rules, state.fields, event);
      const name = event.name
      if(NAME === name){
        if(state.datasets.find(dataset => dataset.name.toLocaleLowerCase() === event.value.toLocaleLowerCase())) {
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
  const datasetsPromise = fetchDatasets(fetch)();
  const groupsPromise = fetchGroups(fetch)();

  const [datasetsResponse, groupsResponse] = await Promise.all([datasetsPromise, groupsPromise]);
  let data;
  if(datasetsResponse.status >= 500 || groupsResponse.status >= 500 ) {
    data = { datasets: [], groups:[], status: resilienceStatus.ERROR };
  } else {
    const datasets = await datasetsResponse.json()
    const groups = await groupsResponse.json()
    data = { datasets, groups, status: resilienceStatus.SUCCESS };
  }
  dispatch( {type: 'init', data});
};

const useNew = (history, fetch) => {
  const [state, dispatch] = useReducer(reducer, initState);
  const onChange = event => dispatch({ type: 'onChange', event });
  const onSubmit = async () => {
    const errors = errorList(state.fields);
    let data = {status: resilienceStatus.SUCCESS};
    if (!errors.length) {
      const fields = state.fields;
      const newDataset = {
        [NAME]: fields[NAME].value,
        [TYPE]: fields[TYPE].value,
        [GROUP]: fields[GROUP].value,
        [CLASSIFICATION]: fields[CLASSIFICATION].value
      }
      const response = await fetchCreateDataset(fetch)(newDataset);
      if(response.status >= 500){
        data = {status: resilienceStatus.ERROR };
      } else {
        history.push('/datasets/confirm');
      }
    }
    dispatch({type: 'onSubmit', data});
  };

  React.useEffect(() => {
    init(fetch, dispatch)();
  }, []);
  
  return { state, onChange, onSubmit };
};

const NewWithResilience = withResilience(New);

const NewContainer = ({ history, fetch }) => {
  const { state, onChange, onSubmit } = useNew(history, fetch);
   return <NewWithResilience {...state} onChange={onChange} onSubmit={onSubmit}  />;
};
const enhance = compose(withCustomFetch(fetch), withRouter);
export default  enhance(NewContainer);

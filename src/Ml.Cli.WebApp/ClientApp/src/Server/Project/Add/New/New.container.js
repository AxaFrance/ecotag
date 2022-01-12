import New from './New';
import { rules } from './New.validation.rules';
import React, { useReducer } from 'react';
import { withRouter } from 'react-router-dom';
import { fetchCreateProject } from './New.service';
import { computeInitialStateErrorMessage, genericHandleChange } from '../../../validation.generic';
import {
  GROUP,
  NAME,
  CLASSIFICATION,
  DATASET,
  NUMBER_CROSS_ANNOTATION,
  TYPE,
  MSG_REQUIRED,
  LABELS,
  MSG_PROJECT_NAME_ALREADY_EXIST
} from './constants';
import compose from '../../../compose';
import withCustomFetch from '../../../withCustomFetch';
import { init } from './New.hook';
import {resilienceStatus, withResilience} from '../../../shared/Resilience';

const errorList = fields => Object.keys(fields).filter(key => setErrorMessage(key)(fields));

const setErrorMessage = key => fields => fields[key].message !== null;

const preInitState = {
  groups: [],
  datasets:[],
  projects: [],
  hasSubmit: false,
  status: resilienceStatus.LOADING,
  fields: {
    [NAME]: { name: NAME, value: '', message: MSG_REQUIRED },
    [CLASSIFICATION]: {
      name: CLASSIFICATION,
      value: '',
      message: MSG_REQUIRED,
    },
    [DATASET]: { name: DATASET, value: '', message: MSG_REQUIRED },
    [GROUP]: { name: GROUP, value: '', message: MSG_REQUIRED },
    [TYPE]: { name: TYPE, value: '', message: MSG_REQUIRED },
    [NUMBER_CROSS_ANNOTATION]: {
      name: NUMBER_CROSS_ANNOTATION,
      value: null,
      message: MSG_REQUIRED,
    },
    [LABELS]: {
      name: LABELS,
      values: [],
      message: MSG_REQUIRED,
    },
  },
};

export const initState = computeInitialStateErrorMessage(preInitState, rules);

export const reducer = (state, action) => {
  switch (action.type) {
    case 'init': {
      const { groups, datasets, projects, status } = action.data;
      return {
        ...state,
        status,
        groups,
        datasets,
        projects,
      };
    }
    case 'onChange': {
      const event = action.event;
      const name = event.name;
      const newValues = event.values;
      const fields = state.fields;
      let newField;
      switch (name) {
        case LABELS:
          const message = newValues.length > 0 ? null : MSG_REQUIRED
          newField = {
            ...fields,
                [name]: {
              ...fields[name],
                  message,
                  values:newValues,
            }};
          break;
        default:
            newField = genericHandleChange(rules, fields, event);
            if(NAME === name){
               if(state.projects.find(project => project.name === event.value)) {
                 newField = {
                   ...newField,
                   [name]: {
                     ...newField[name],
                     message: MSG_PROJECT_NAME_ALREADY_EXIST
                   }};
               }   
            }
            break;
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
    case 'onSubmitStarted': {
      return {
        ...state,
        status : resilienceStatus.LOADING,
      };
    }
    case 'onSubmitEnded': {
      return {
        ...state,
        status : resilienceStatus.ERROR,
      };
    }
    default:
      throw new Error();
  }
};

export const createProject = async (history, fetch, state, dispatch) => {
  const errors = errorList(state.fields);
  dispatch({ type: 'onSubmit' });
  if (errors.length) {
    return;
  }
  dispatch({ type: 'onSubmitStarted'});
  
    const newProject = {
      name: state.fields[NAME].value,
      dataSetId: state.fields[DATASET].value,
      groupId: state.fields[GROUP].value,
      typeAnnotation: state.fields[TYPE].value,
      numberTagToDo: state.fields[NUMBER_CROSS_ANNOTATION].value,
      classification: state.fields[CLASSIFICATION].value,
      labels: state.fields[LABELS].values,
    };
    const response = await fetchCreateProject(fetch)(newProject);
    if(response.status >= 500){
      dispatch({ type: 'onSubmitEnded'});
    } else{
      history.push({
        pathname: '/projects/confirm',
        state: { project : await response.json()},
      });  
    }
};

const useNew = (fetch, history) => {
  const [state, dispatch] = useReducer(reducer, initState);
  const onChange = event => dispatch({ type: 'onChange', event });
  const onSubmit = () => createProject(history, fetch, state, dispatch);
  React.useEffect(() => {
    init(fetch, dispatch)();
  }, []);
  return { state, onChange, onSubmit };
};

const NewWithResilience = withResilience(New)

export const NewContainer = ({ fetch, history }) => {
  const { state, onChange, onSubmit } = useNew(fetch, history);
  return <NewWithResilience {...state} onChange={onChange} onSubmit={onSubmit} />;
};


const enhance = compose(withCustomFetch(fetch), withRouter);
const EnhancedNewContainer = enhance(NewContainer);

export default EnhancedNewContainer;

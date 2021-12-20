import New from './New';
import { rules } from './New.validation.rules';
import React, { useReducer } from 'react';
import { withRouter } from 'react-router-dom';
import { fetchCreateProject } from './New.service';
import { computeInitialStateErrorMessage, genericHandleChange } from '../../../validation.generic';
import { GROUP, NAME, CLASSIFICATION, DATASET, NUMBER_CROSS_ANNOTATION, TYPE, MSG_REQUIRED, LABELS } from './constants';
import compose from '../../../compose';
import withCustomFetch from '../../../withCustomFetch';
import { init } from './New.hook';

const errorList = fields => Object.keys(fields).filter(key => setErrorMessage(key)(fields));

const setErrorMessage = key => fields => fields[key].message !== null;

const preInitState = {
  groups: [],
  hasSubmit: false,
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
      values: [{ name: 'recto', id: '1', color: '#212121' }],
      message: null,
    },
  },
};

export const initState = computeInitialStateErrorMessage(preInitState, rules);

export const reducer = (state, action) => {
  switch (action.type) {
    case 'init': {
      const { groups, datasets } = action.data;
      return {
        ...state,
        loading: false,
        groups,
        datasets,
      };
    }
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

export const createProject = async (history, fetch, state, dispatch) => {
  const errors = errorList(state.fields);
  dispatch({ type: 'onSubmit' });
  if (!errors.length) {
    const newProject = {
      name: state.fields[NAME].value,
      dataSetId: state.fields[DATASET].value,
      groupId: state.fields[GROUP].value,
      typeAnnotation: state.fields[TYPE].value,
      numberTagToDo: state.fields[NUMBER_CROSS_ANNOTATION].value,
      classification: state.fields[CLASSIFICATION].value,
      labels: state.fields[LABELS].values,
    };
    const project = await fetchCreateProject(fetch)(newProject);
    history.push({
      pathname: '/projects/confirm',
      state: { project },
    });
  }
};

const useNew = (fetch, history) => {
  const [state, dispatch] = useReducer(reducer, initState);
  const onChange = event => dispatch({ type: 'onChange', event });
  const onSubmit = () => createProject(history, fetch, state, dispatch);
  React.useEffect(() => {
    init(fetch, dispatch)();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return { state, onChange, onSubmit };
};

export const NewContainer = ({ fetch, history }) => {
  const { state, onChange, onSubmit } = useNew(fetch, history);
  return <New {...state} onChange={onChange} onSubmit={onSubmit} />;
};

const enhance = compose(withCustomFetch(fetch), withRouter);

const EnhancedNewContainer = enhance(NewContainer);

export default EnhancedNewContainer;

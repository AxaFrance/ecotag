import { useParams } from 'react-router';
import React, { useEffect, useReducer } from 'react';
import AnnotationDispatch from './AnnotationDispatch';
import withLoader from '../../withLoader';
import { fetchProject } from '../Page/Page.service';
import withCustomFetch from '../../withCustomFetch';
import compose from '../../compose';
import withAuthentication from '../../withAuthentication';

const AnnotationDispatchWithLoader = withLoader(AnnotationDispatch);

export const init = (fetch, dispatch) => async projectId => {
  const project = await fetchProject(fetch)(projectId);
  dispatch({ type: 'init', data: { project } });
};

export const reducer = (state, action) => {
  switch (action.type) {
    case 'init': {
      const { project } = action.data;
      return {
        ...state,
        loading: false,
        project,
      };
    }
    default:
      throw new Error();
  }
};

export const initialState = {
  loading: true,
  project: {
    labels: [],
    users: [],
  },
};

const usePage = (fetch, user) => {
  const { projectId } = useParams();
  const [state, dispatch] = useReducer(reducer, initialState);
  useEffect(() => {
    state.user = user;
    init(fetch, dispatch)(projectId);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return { state };
};

export const AnnotationDispatchContainer = ({ fetch, user }) => {
  const { state } = usePage(fetch, user);
  return <AnnotationDispatchWithLoader {...state} />;
};

const enhance = compose(withCustomFetch(fetch), withAuthentication());
export default enhance(AnnotationDispatchContainer);

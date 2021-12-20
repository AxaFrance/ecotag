import { useParams } from 'react-router-dom';
import React, { useEffect, useReducer } from 'react';
import Page from './Page';
import withLoader from '../../withLoader';
import { fetchProject, fetchDataset, fetchGroup } from './Page.service';
import withCustomFetch from '../../withCustomFetch';
import compose from '../../compose';
import withAuthentication from '../../withAuthentication';

const PageWithLoader = withLoader(Page);

export const init = (fetch, dispatch) => async id => {
  const project = await fetchProject(fetch)(id);
  const dataset = await fetchDataset(fetch)(project.dataSetId);
  const group = await fetchGroup(fetch)(project.groupId);
  dispatch({ type: 'init', data: { project, dataset, group } });
};

export const reducer = (state, action) => {
  switch (action.type) {
    case 'init': {
      const { project, dataset, group } = action.data;
      return {
        ...state,
        loading: false,
        project,
        dataset,
        group,
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
  dataset: {},
  group: {},
  user: {},
};

const usePage = (fetch, user) => {
  const { id } = useParams();
  const [state, dispatch] = useReducer(reducer, initialState);
  useEffect(() => {
    state.user = user;
    init(fetch, dispatch)(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return { state };
};

export const PageContainer = ({ fetch, user }) => {
  const { state } = usePage(fetch, user);
  return <PageWithLoader {...state} />;
};

const enhance = compose(withCustomFetch(fetch), withAuthentication());
export default enhance(PageContainer);

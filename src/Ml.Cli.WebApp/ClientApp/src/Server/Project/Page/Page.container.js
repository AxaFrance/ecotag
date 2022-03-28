import { useParams } from 'react-router-dom';
import React, { useEffect, useReducer } from 'react';
import Page from './Page';
import { fetchProject, fetchDataset } from '../Project.service';
import {fetchGroup, fetchUsers} from '../../Group/Group.service.js';
import withCustomFetch from '../../withCustomFetch';
import compose from '../../compose';
import withAuthentication from '../../withAuthentication';
import {resilienceStatus, withResilience} from "../../shared/Resilience";

const PageWithResilience = withResilience(Page);

export const init = (fetch, dispatch) => async id => {
  const projectResponse = await fetchProject(fetch)(id);
  
  if(projectResponse.status >= 500){
    dispatch({ type: 'init', data: { project:null, dataset:null, group:null, users: [], status: resilienceStatus.ERROR } });
    return;
  }
  const project = await projectResponse.json();
  const datasetPromise = fetchDataset(fetch)(project.id, project.datasetId);
  const groupPromise = fetchGroup(fetch)(project.groupId);
  const usersPromise = fetchUsers(fetch)()
  
  const [datasetResponse, groupResponse, usersResponse] = await Promise.all([datasetPromise, groupPromise, usersPromise]);

  if(datasetResponse.status >= 500 || groupPromise.status >= 500 || usersResponse.status >= 500){
    dispatch({ type: 'init', data: { project:null, dataset:null, group:null, users: [], status: resilienceStatus.ERROR } });
    return;
  }
  const dataset = await datasetResponse.json();
  const group = await groupResponse.json();
  const users = await usersResponse.json();
  
  dispatch({ type: 'init', data: { project, dataset, group, users, status: resilienceStatus.SUCCESS } });
};

export const reducer = (state, action) => {
  switch (action.type) {
    case 'init': {
      const { project, dataset, group, users, status } = action.data;
      return {
        ...state,
        status,
        project,
        dataset,
        users,
        group,
      };
    }
    default:
      throw new Error();
  }
};

export const initialState = {
  status: resilienceStatus.LOADING,
  project: {
    createDate: new Date(),
    name: "",
    labels: [],
    numberCrossAnnotation: 0,
    annotationStatus: {
      isAnnotationClosed: true,
      numberAnnotationsByUsers: [],
      numberAnnotationsDone: 0,
      numberAnnotationsToDo:0,
      percentageNumberAnnotationsDone:0
    }
  },
  dataset: {name: "", type:"", files:[], annotationType:""},
  group: {userIds:[]},
  users: [],
};

const usePage = (fetch) => {
  const { id } = useParams();
  const [state, dispatch] = useReducer(reducer, initialState);
  useEffect(() => {
    init(fetch, dispatch)(id);
  }, []);
  return { state };
};

export const PageContainer = ({ fetch }) => {
  const { state } = usePage(fetch);
  return <PageWithResilience {...state} />;
};

const enhance = compose(withCustomFetch(fetch), withAuthentication());
export default enhance(PageContainer);

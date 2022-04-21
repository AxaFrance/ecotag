import { useParams } from 'react-router-dom';
import React, { useEffect, useReducer } from 'react';
import Page from './Page';
import {
  fetchProject,
  fetchDataset,
  fetchAnnotationsStatus,
  fetchExportAnnotations,
  fetchLockProject
} from '../Project.service';
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
  const annotationsStatusPromise = await fetchAnnotationsStatus(fetch)(project.id);
  
  const [datasetResponse, groupResponse, usersResponse, annotationsStatusResponse] = await Promise.all([datasetPromise, groupPromise, usersPromise, annotationsStatusPromise]);

  if(datasetResponse.status >= 500 || groupPromise.status >= 500 || usersResponse.status >= 500 || annotationsStatusResponse.status >= 500){
    dispatch({ type: 'init', data: { project:null, dataset:null, annotationsStatus:null, group:null, users: [], status: resilienceStatus.ERROR } });
    return;
  }
  const dataset = await datasetResponse.json();
  const group = await groupResponse.json();
  const users = await usersResponse.json();
  const annotationsStatus = await annotationsStatusResponse.json();
  
  dispatch({ type: 'init', data: { project, dataset, group, users, annotationsStatus, status: resilienceStatus.SUCCESS } });
};

export const reducer = (state, action) => {
  switch (action.type) {
    case 'init': {
      const { project, dataset, group, users, status, annotationsStatus } = action.data;
      return {
        ...state,
        status,
        project,
        dataset,
        annotationsStatus,
        users,
        group,
      };
    }
    case 'open_modal': {
      const {isModalOpened} = action.data;
      return {
        ...state,
        isModalOpened
      };
    }
    case 'lock_project': {
      const {status, isModalOpened} = action.data;
      return {
        ...state,
        status,
        isModalOpened
      };
    }
    default:
      throw new Error();
  }
};

export const initialState = {
  status: resilienceStatus.LOADING,
  project: {
    id: null,
    createDate: 0,
    name: "",
    labels: [],
    numberCrossAnnotation: 0,
  },
  dataset: {name: "", type:"", files:[], annotationType:""},
  group: {userIds:[]},
  users: [],
  annotationsStatus: {
    isAnnotationClosed: true,
    numberAnnotationsByUsers: [],
    numberAnnotationsDone: 0,
    numberAnnotationsToDo:0,
    percentageNumberAnnotationsDone:0
  },
  isModalOpened: false
};

const usePage = (fetch) => {
  const { id } = useParams();
  const [state, dispatch] = useReducer(reducer, initialState);
  const onExport = projectId => fetchExportAnnotations(fetch)(projectId);
  const lock = {
    onCancel: () => dispatch({type: 'open_modal', data: {isModalOpened: false}}),
    onSubmit: async () => {
      const response = await fetchLockProject(fetch)(id);
      let data;
      if (response.status >= 500) {
        data = {status: resilienceStatus.ERROR, isModalOpened: false};
      } else {
        data = {status: resilienceStatus.SUCCESS, isModalOpened: false};
      }
      dispatch({data, type: 'lock_project'});
    },
    onLockAction: () => dispatch({type: 'open_modal', data: {isModalOpened: true}})
  };
  useEffect(() => {
    init(fetch, dispatch)(id);
  }, []);
  return { state, onExport, lock };
};

export const PageContainer = ({ fetch, user}) => {
  const { state, onExport, lock } = usePage(fetch);
  return <PageWithResilience {...state} onExport={onExport} user={user} lock={lock} />;
};

const enhance = compose(withCustomFetch(fetch), withAuthentication());
export default enhance(PageContainer);

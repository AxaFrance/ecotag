import { useParams } from 'react-router';
import React, { useEffect, useReducer } from 'react';
import AnnotationDispatch from './AnnotationDispatch';
import withLoader from '../../withLoader';
import { fetchProject } from '../Page/Page.service';
import withCustomFetch from '../../withCustomFetch';
import compose from '../../compose';
import withAuthentication from '../../withAuthentication';
import Title from '../../../TitleBar';
import {resilienceStatus, withResilience} from "../../shared/Resilience";


const PageAnnotation = ({project, ...state}) => <>
  <Title title={project.name} subtitle={`Project de type ${project.typeAnnotation} classification ${project.classification}` } goTo={`/projects/${project.id}`} />
  <AnnotationDispatch {...state} project={project} /></>
const PageAnnotationWithResilience = withResilience(PageAnnotation);

export const init = (fetch, dispatch) => async projectId => {
  const response = await fetchProject(fetch)(projectId);
  let data;
  if(response.status >= 500){
    data = {
      project: null,
      status: resilienceStatus.ERROR
    };
  } else {
    const project = await response.json();
    data = {
      project,
      status: resilienceStatus.SUCCESS
    };
  }
  
  dispatch({ type: 'init', data });
};

export const reducer = (state, action) => {
  switch (action.type) {
    case 'init': {
      const { project, status } = action.data;
      return {
        ...state,
        status,
        project,
      };
    }
    default:
      throw new Error();
  }
};

export const initialState = {
  status: resilienceStatus.LOADING,
  project: {
    labels: [],
    users: [],
    name: "-",
    typeAnnotation: ""
  },
};

const usePage = (fetch) => {
  const { projectId } = useParams();
  const [state, dispatch] = useReducer(reducer, initialState);
  useEffect(() => {
    init(fetch, dispatch)(projectId);
  }, []);
  return { state };
};

export const AnnotationDispatchContainer = ({ fetch }) => {
  const { state } = usePage(fetch);
  return <PageAnnotationWithResilience {...state} />;
};

const enhance = compose(withCustomFetch(fetch), withAuthentication());
export default enhance(AnnotationDispatchContainer);

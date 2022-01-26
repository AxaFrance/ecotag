import { useParams } from 'react-router';
import React, { useEffect, useReducer } from 'react';
import AnnotationDispatch from './AnnotationDispatch';
import { fetchProject, fetchReserveAnnotations } from '../Page/Page.service';
import withCustomFetch from '../../withCustomFetch';
import compose from '../../compose';
import withAuthentication from '../../withAuthentication';
import Title from '../../../TitleBar';
import {resilienceStatus, withResilience} from "../../shared/Resilience";
import Toolbar from "./Toolbar";

const onSubmit = () => {
  console.log('mock Submit');
};

const onNext = () => {
  console.log('mock Submit');
};
const onPrevious = () => {
  console.log('mock Submit');
};

const url = "https://d3njjcbhbojbot.cloudfront.net/api/utilities/v1/imageproxy/https://coursera-course-photos.s3.amazonaws.com/b3/b6693cb0424a938c0376ff89bb5f5b/RH_Logo_Whitebg1200x1200.png?auto=format%2Ccompress&dpr=1";
const PageAnnotation = ({project, ...state}) => <>
  <Title title={project.name} subtitle={`Project de type ${project.typeAnnotation} classification ${project.classification}` } goTo={`/projects/${project.id}`} />
  <Toolbar onNext={onNext} onPrevious={onPrevious} />
  <AnnotationDispatch {...state} project={project} onSubmit={onSubmit} url={url} /></>
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

export const reserveAnnotation = (fetch, dispatch) => async projectId => {
  const response = await fetchReserveAnnotations(fetch)(projectId);
  let data;
  if(response.status >= 500){
    data = {
      status: resilienceStatus.ERROR,
      items: [],
    }
  } else {
    const annotations = await response.json();
    data = {
      status: resilienceStatus.ERROR,
      items: [...annotations],
    }
  }

  dispatch({ type: 'reserve_annotation', data });
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
    case 'reserve_annotation': {
      const { status, items } = action.data;
      return {
        ...state,
        annotations: {
          status,
          items: [...state.annotations.items, ...items]
        }
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
  annotations: {
    status: resilienceStatus.LOADING,
    items: [],
  }
};

const usePage = (fetch) => {
  const { projectId } = useParams();
  const [state, dispatch] = useReducer(reducer, initialState);
  useEffect(() => {
    init(fetch, dispatch)(projectId)
        .then(() => reserveAnnotation(fetch, dispatch)(projectId));
  }, []);
  return { state };
};

export const AnnotationDispatchContainer = ({ fetch }) => {
  const { state } = usePage(fetch);
  return <PageAnnotationWithResilience {...state} />;
};

const enhance = compose(withCustomFetch(fetch), withAuthentication());
export default enhance(AnnotationDispatchContainer);

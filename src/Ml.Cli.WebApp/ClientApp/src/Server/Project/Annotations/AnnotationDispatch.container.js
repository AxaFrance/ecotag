import {useHistory, useParams} from 'react-router';
import React, { useEffect, useReducer } from 'react';
import AnnotationDispatch from './AnnotationDispatch';
import { fetchProject, fetchReserveAnnotations } from '../Page/Page.service';
import withCustomFetch from '../../withCustomFetch';
import compose from '../../compose';
import withAuthentication from '../../withAuthentication';
import Title from '../../../TitleBar';
import {resilienceStatus, withResilience} from "../../shared/Resilience";
import Toolbar from "./Toolbar";
import AnnotationsToolbar from "../../../Toolkit/Annotations/AnnotationsToolbar";


const ReservationStatus = ({resilienceStatus}) => {
    const { ERROR, SUCCESS, LOADING, POST} = resilienceStatus;
    return (
        <div className="reservation-status" style={{absolute:true, top:"0px", right:"0px"}}>
          {
            {
              [LOADING]:<span>Chargement en cours</span> ,
              [POST]: <span>Chargement en cours</span>,
              [ERROR]: (
                  <span>Erreur lors du chargement</span>
              ),
              [SUCCESS]: null
            }[status]
          }
        </div>
    );

}

const Content = ({project, currentItem, onSubmit, onNext, onPrevious, hasPrevious, hasNext, documentId, reservationStatus}) => {
  switch (documentId){
    case "end":
      return <p>Fin</p>;
    case "start":
      return <p>Chargement en cours</p>;
    default:
      return (currentItem !=null ? <>
        <ReservationStatus resilienceStatus={reservationStatus} />
        <AnnotationsToolbar onNext={onNext} onPrevious={onPrevious}  isPreviousDisabled={!hasPrevious} isNextDisabled={!hasNext} text={currentItem.fileName}  />
        <AnnotationDispatch project={project} onSubmit={onSubmit} url={`/api/server/projects/${project.id}/files/${currentItem.fileId}`} />
        </> : null);
  }
}

const PageAnnotation = ({project, currentItem, onSubmit, onNext, onPrevious, hasPrevious, hasNext, reservationStatus}) => <>
  <Title title={project.name} subtitle={`Project de type ${project.typeAnnotation} classification ${project.classification}` } goTo={`/projects/${project.id}`} />
  <Content reservationStatus={reservationStatus} 
           onNext={onNext} 
           onPrevious={onPrevious}  
           project={project}
           onSubmit={onSubmit} 
           currentItem={currentItem} 
           hasPrevious={hasPrevious} 
           hasNext={hasNext} />
  </>

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

export const reserveAnnotation = (fetch, dispatch, history) => async (projectId, currentItemsLength, status) => {
  if(status === resilienceStatus.LOADING) {
    return;
  }
  dispatch({ type: 'reserve_annotation_start'});
  const response = await fetchReserveAnnotations(fetch)(projectId);
  let data;
  if(response.status >= 500) {
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
  if(currentItemsLength === 0 && data.items.length > 0){
    const url = `${data.items[0].fileId}`;
    history.replace(url);
  }
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
      const newItems =  [...state.annotations.items];
      let isReservationFinished=true;
      items.forEach(item => {
         const currentItem = newItems.find((newItem) => newItem.fileId === item.fileId);
          if(!currentItem) {
            newItems.push(item);
            isReservationFinished=false;
          }
      })
      console.log(newItems);
      
      return {
        ...state,
        annotations: {
          isReservationFinished,
          ...state.annotations,
          status,
          items: newItems
        }
      };
    }
    case 'reserve_annotation_start': {
      return {
        ...state,
        annotations: {
          ...state.annotations,
          status: resilienceStatus.LOADING,
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
    status: resilienceStatus.SUCCESS,
    items: [],
    isReservationFinished:false
  }
};

const usePage = (fetch) => {
  const { projectId, documentId } = useParams();
  const history = useHistory();
  const [state, dispatch] = useReducer(reducer, initialState);
  
  useEffect(() => {
    if(state.status === resilienceStatus.LOADING){
    init(fetch, dispatch)(projectId)
        .then(() => reserveAnnotation(fetch, dispatch, history)(projectId, state.annotations.items.length, state.annotations.status));
    } else {
      const items = state.annotations.items;
      const currentItem = items.find((item) => item.fileId === documentId);
      const currentIndex = !currentItem ? -1 : items.indexOf(currentItem);
      if(currentIndex + 1 === items.length){
        reserveAnnotation(fetch, dispatch, history)(projectId, state.annotations.items.length, state.annotations.status)
      }
    }
  }, [documentId]);
  
  const items = state.annotations.items;
  const itemSize = items.length;
  
  const currentItem = items.find((item) => item.fileId === documentId);
  const currentIndex = !currentItem ? -1 : items.indexOf(currentItem);
  //console.log(currentItem)
  //console.log(currentIndex)
  let previousUrl = null;
  let nextUrl = null;

  let hasNext = false;
  let hasPrevious = false
  if(currentIndex >= 0) {
    hasPrevious = currentIndex > 0
    if(currentIndex > 0) {
      previousUrl = `${items[currentIndex-1].fileId}`;
    }
    hasNext = currentIndex + 1 < itemSize
    if(hasNext) {
      const nextDocumentId = currentIndex + 1 < itemSize ? items[currentIndex+1].fileId : "end" ;
      nextUrl = `${nextDocumentId}`;
    }
  }

  const onSubmit = () => {
    history.push(nextUrl);
  };
  const onNext = () => {
    history.push(nextUrl);
  };
  const onPrevious = () => {
    history.push(previousUrl);
  };
  
  return { state, currentItem: currentItem, onSubmit, onNext, onPrevious, hasPrevious, hasNext, documentId };
};

export const AnnotationDispatchContainer = ({ fetch }) => {
  const { state, currentItem, onSubmit, onNext, onPrevious, hasPrevious, hasNext, documentId } = usePage(fetch);
  return <PageAnnotationWithResilience 
      project={state.project}
      status={state.status} 
                                       documentId={documentId} currentItem={currentItem} onSubmit={onSubmit} onNext={onNext} onPrevious={onPrevious} 
                                       hasPrevious={hasPrevious} hasNext={hasNext} reservationStatus={state.annotations.status} />;
};

const enhance = compose(withCustomFetch(fetch), withAuthentication());
export default enhance(AnnotationDispatchContainer);

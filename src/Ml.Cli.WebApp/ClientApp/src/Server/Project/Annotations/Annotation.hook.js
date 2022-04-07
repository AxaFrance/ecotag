import {resilienceStatus} from "../../shared/Resilience";
import {useHistory, useParams} from "react-router";
import {useEffect, useReducer} from "react";
import {fetchAnnotate, fetchProject, fetchReserveAnnotations} from "../Project.service";
import {reducer} from "./Annotation.reducer";

export const initialState = {
    status: resilienceStatus.LOADING,
    project: {
        labels: [],
        users: [],
        name: "-",
        annotationType: ""
    },
    annotations: {
        reservationStatus: resilienceStatus.SUCCESS,
        annotationStatus: resilienceStatus.SUCCESS,
        items: [],
        isReservationFinished: false
    }
};
export const init = (fetch, dispatch) => async projectId => {
    const response = await fetchProject(fetch)(projectId);
    let data;
    if (response.status >= 500) {
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

    dispatch({type: 'init', data});
};
export const reserveAnnotation = (fetch, dispatch, history) => async (projectId, documentId, currentItemsLength, status) => {
    if (status === resilienceStatus.LOADING) {
        return;
    }
    dispatch({type: 'reserve_annotation_start'});

    let fileId = null;
    if (documentId !== "end" && documentId !== "start") {
        fileId = documentId;
    }

    const response = await fetchReserveAnnotations(fetch)(projectId, fileId);
    let data;
    if (response.status >= 500) {
        data = {
            status: resilienceStatus.ERROR,
            items: [],
        }
    } else {
        const annotations = await response.json();
        const promises = []
        const annotationLength = annotations.length;
        for (let i = 0; i < annotationLength; i++) {
            const annotation = annotations[i];
            const url = `projects/${projectId}/files/${annotation.fileId}`;
            const responsePromise = fetch(url, {method: 'GET'});
            promises.push(responsePromise);
        }
        const responses = await Promise.all(promises);
        const blobPromises = []
        for (let i = 0; i < annotationLength; i++) {
            const response = responses[i];
            const blobPromise =   await response.blob();
            blobPromises.push(blobPromise);
        }
        const blobs = await Promise.all(blobPromises);
        for (let i = 0; i < annotationLength; i++) {
            const annotation = annotations[i];
            annotation.blobUrl = window.URL.createObjectURL(blobs[i]);
        }
        data = {
            status: resilienceStatus.SUCCESS,
            items: [...annotations],
        }
    }
    dispatch({type: 'reserve_annotation', data});

    if (data.status === resilienceStatus.ERROR) {
        return;
    }

    const numberItems = data.items.length;
    if (currentItemsLength === 0 && numberItems === 0) {
        const url = "end";
        history.replace(url);
    } else if (fileId == null && currentItemsLength === 0 && numberItems > 0) {
        const url = `${data.items[0].fileId}`;
        history.replace(url);
    }
};
export const annotate = (fetch, dispatch, history) => async (projectId, fileId, annotation, annotationId, nextUrl, status) => {
    if (status === resilienceStatus.LOADING ||status === resilienceStatus.POST) {
        return;
    }
    history.push(nextUrl);
    dispatch({type: 'annotate_start'});
    const response = await fetchAnnotate(fetch)(projectId, fileId, annotationId, annotation);
    let data;
    if (response.status >= 500) {
        data = {
            status: resilienceStatus.ERROR,
            annotation,
            fileId,
        }
    } else {
        const id = !annotationId ? await response.json() : annotationId;
        data = {
            status: resilienceStatus.SUCCESS,
            annotation: {id, expectedOutput: annotation},
            fileId
        }
    }
    dispatch({type: 'annotate', data});
    if (data.status === resilienceStatus.ERROR) {
        return;
    }
    
};

export const usePage = (fetch) => {
    const {projectId, documentId} = useParams();
    const history = useHistory();
    const [state, dispatch] = useReducer(reducer, initialState);

    useEffect(() => {
        if (state.status === resilienceStatus.LOADING) {
            init(fetch, dispatch)(projectId)
                .then(() => reserveAnnotation(fetch, dispatch, history)(projectId, documentId, state.annotations.items.length, state.annotations.reservationStatus));
        } else {
            const items = state.annotations.items;
            const currentItem = items.find((item) => item.fileId === documentId);
            const currentIndex = !currentItem ? -1 : items.indexOf(currentItem);
            if (currentIndex + 5 === items.length) {
                reserveAnnotation(fetch, dispatch, history)(projectId, null, state.annotations.items.length, state.annotations.reservationStatus)
            }
        }
    }, [documentId]);

    const items = state.annotations.items;
    const itemSize = items.length;

    const currentItem = items.find((item) => item.fileId === documentId);
    const currentIndex = !currentItem ? -1 : items.indexOf(currentItem);
    let previousUrl = null;
    let nextUrl = null;

    let hasNext = false;
    let hasPrevious = false
    if (currentIndex >= 0) {
        hasPrevious = currentIndex > 0
        if (currentIndex > 0) {
            previousUrl = `${items[currentIndex - 1].fileId}`;
        }
        hasNext = currentIndex + 1 < itemSize
        const nextDocumentId = hasNext ? items[currentIndex + 1].fileId : "end";
        nextUrl = `${nextDocumentId}`;
    }

    const onSubmit = (annotation) => {
        annotate(fetch, dispatch, history)(projectId, currentItem.fileId, annotation, currentItem.annotation.id, nextUrl, state.annotations.annotationStatus);
    };
    const onNext = () => {
        history.push(nextUrl);
    };
    const onPrevious = () => {
        history.push(previousUrl);
    };

    return {state, currentItem: currentItem, onSubmit, onNext, onPrevious, hasPrevious, hasNext, documentId};
};
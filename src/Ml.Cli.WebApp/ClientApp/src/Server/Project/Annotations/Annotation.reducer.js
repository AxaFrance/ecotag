import {resilienceStatus} from "../../shared/Resilience";

export const annotationItemStatus = {
    NONE: 'NONE',
    SAVED_PREVIOUS_SESSION: 'SAVED_PREVIOUS_SESSION',
    SAVED: 'SAVED',
    ERROR: 'ERROR'
};


export const reducer = (state, action) => {
    switch (action.type) {
        case 'init': {
            const {project, status} = action.data;
            return {
                ...state,
                status,
                project,
            };
        }
        case 'reserve_annotation': {
            const {status, items} = action.data;
            const newItems = [...state.annotations.items];
            let isReservationFinished = true;
            items.forEach(item => {
                const currentItem = newItems.find((newItem) => newItem.fileId === item.fileId);
                if (!currentItem) {

                    const annotation = {
                        expectedOutput: (item.annotation && item.annotation.expectedOutputJson) ? JSON.parse(item.annotation.expectedOutputJson) : null,
                        id: item.annotation ? item.annotation.id: null,
                        status: item.annotation && item.annotation.id ? annotationItemStatus.SAVED_PREVIOUS_SESSION: annotationItemStatus.NONE,
                        statusDate: Date.now()
                    }

                    const itemFormatted = {...item, annotation};
                    newItems.push(itemFormatted);
                    isReservationFinished = false;
                }
            });

            return {
                ...state,
                annotations: {
                    isReservationFinished,
                    ...state.annotations,
                    reservationStatus: status,
                    items: newItems
                }
            };
        }
        case 'reserve_annotation_start': {
            return {
                ...state,
                annotations: {
                    ...state.annotations,
                    reservationStatus: resilienceStatus.LOADING,
                }
            };
        }
        case 'annotate_start': {
            return {
                ...state,
                annotations: {
                    ...state.annotations,
                    annotationStatus: resilienceStatus.POST,
                }
            };
        }
        case 'annotate': {
            const {annotation, fileId, status} = action.data;
            const newItems = [...state.annotations.items];
            const currentItem = newItems.find((item) => item.fileId === fileId);
            const newCurrentItem = {...currentItem, 
                annotation, 
                status: status === resilienceStatus.ERROR ? annotationItemStatus.ERROR: annotationItemStatus.SAVED,
                statusDate: Date.now()
            };

            newItems.splice(newItems.indexOf(currentItem), 1, newCurrentItem);
            return {
                ...state,
                annotations: {
                    ...state.annotations,
                    annotationStatus: status,
                    items: newItems
                }
            };
        }
        default:
            throw new Error();
    }
};
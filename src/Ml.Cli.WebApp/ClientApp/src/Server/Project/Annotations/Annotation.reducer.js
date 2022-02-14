﻿import {resilienceStatus} from "../../shared/Resilience";

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
                        expectedOutput: item.annotation.expectedOutputJson ? JSON.parse(item.annotation.expectedOutputJson) : null,
                        id: item.annotation.id,
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
                    annotationStatus: resilienceStatus.LOADING,
                }
            };
        }
        case 'annotate': {
            const {annotation, fileId, status} = action.data;
            const newItems = [...state.annotations.items];
            const currentItem = newItems.find((item) => item.fileId === fileId);
            const newCurrentItem = {...currentItem, annotation};

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
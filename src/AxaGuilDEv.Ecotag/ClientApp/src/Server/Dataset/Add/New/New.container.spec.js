import '@testing-library/jest-dom/extend-expect';
import React from 'react';
import {render, waitFor} from '@testing-library/react';
import {BrowserRouter as Router} from "react-router-dom";
import {NewContainer, preInitState, reducer} from "./New.container";
import {resilienceStatus} from "../../../shared/Resilience";
import {
    DATASETS_IMPORT,
    GROUP,
    IMPORTED_DATASET_NAME,
    MSG_DATASET_NAME_ALREADY_EXIST,
    MSG_REQUIRED,
    NAME,
    TYPE
} from "./constants";

const fetch = () => {
    return {
        ok: true,
        json: () => Promise.resolve({})
    }
};

describe('New.container', () => {
    it('NewContainer render correctly', async () => {
        const environment = {datasets: {isBlobTransferActive: true}};
        const {container, getAllByText} = render(<Router><NewContainer fetch={fetch}
                                                                       environment={environment}/></Router>);
        await waitFor(() => expect(container.querySelector(".af-spinner--active")).toBeNull());
        await waitFor(() => getAllByText(/Nouveau dataset/i));
    });

    describe('New.reducer', () => {
        it('Should set the new fields with asked values when calling OnChange action', () => {
            const givenState = {...preInitState};
            const givenAction = {
                type: 'onChange',
                event: {
                    name: 'type',
                    value: 'Image'
                }
            };
            const actualState = reducer(givenState, givenAction);
            expect(actualState).toMatchObject({
                ...givenState,
                fields: {
                    ...givenState.fields,
                    [TYPE]: {name: TYPE, value: 'Image', message: null},
                }
            });
        });
        it('Should set the new fields when calling onChange action with name event', () => {
            const givenState = {
                ...preInitState,
                datasets: [{name: "datasetName"}, {name: "otherDatasetName"}]
            };
            const givenAction = {
                type: 'onChange',
                event: {
                    name: 'name',
                    value: 'datasetName'
                }
            };
            const actualState = reducer(givenState, givenAction);
            expect(actualState).toMatchObject({
                ...givenState,
                fields: {
                    ...givenState.fields,
                    [NAME]: {name: NAME, value: 'datasetName', message: MSG_DATASET_NAME_ALREADY_EXIST}
                }
            });
        });
        it('Should set the new fields when calling onChange action with datasets import event', () => {
            const givenState = {...preInitState};
            const givenAction = {
                type: 'onChange',
                event: {
                    name: 'datasetsImport'
                }
            };
            const actualState = reducer(givenState, givenAction);
            expect(actualState).toMatchObject({
                ...givenState,
                fields: {
                    ...givenState.fields,
                    [DATASETS_IMPORT]: {name: DATASETS_IMPORT, isChecked: false, message: null},
                    [IMPORTED_DATASET_NAME]: {
                        name: IMPORTED_DATASET_NAME,
                        value: '',
                        message: "",
                        disabled: true
                    }
                }
            });

        });
        it('Should set the new fields when calling onChange action with group event', () => {
            const givenState = {...preInitState};
            const givenAction = {
                type: 'onChange',
                event: {
                    name: 'groupId',
                    value: 'someGroupName'
                }
            };
            const actualState = reducer(givenState, givenAction);
            expect(actualState).toMatchObject({
                ...givenState,
                fields: {
                    ...givenState.fields,
                    [GROUP]: {
                        name: GROUP,
                        value: 'someGroupName',
                        message: null
                    },
                    [IMPORTED_DATASET_NAME]: {
                        name: IMPORTED_DATASET_NAME,
                        value: '',
                        message: MSG_REQUIRED,
                        disabled: false
                    }
                }
            });
        });
        it('Should assert submission on onSubmit action', () => {
            const givenState = {...preInitState};
            const givenAction = {type: 'onSubmit', data: {status: resilienceStatus.SUCCESS}};
            const actualState = reducer(givenState, givenAction);
            expect(actualState).toMatchObject({
                ...givenState,
                hasSubmit: true,
                status: resilienceStatus.SUCCESS
            })
        });
        it('Should throw an error by default', (done) => {
            const givenState = {};
            const givenAction = {type: 'wrongActionName'};
            try {
                reducer(givenState, givenAction);
                fail(error);
            } catch (error) {
                done();
            }
        });
    })
});


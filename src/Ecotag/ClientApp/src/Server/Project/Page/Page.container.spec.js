import '@testing-library/jest-dom/extend-expect';
import React from 'react';
import {render, waitFor} from '@testing-library/react';
import {initialState, onLockSubmit, PageContainer, reducer} from './Page.container';
import {BrowserRouter as Router} from "react-router-dom";
import {resilienceStatus} from "../../shared/Resilience";
import {DataScientist} from "../../withAuthentication";
import {changeProjectTranslationLanguage} from "../../../useProjectTranslation";

function fail(message = "The fail function was called") {
    throw new Error(message);
}

describe('Page.container', () => {
    const givenDataset = {
        "id": "0001",
        "name": "Green card",
        "type": "Image",
        "numberFiles": 300,
        "createDate": new Date("10-30-2019").getTime(),
        files: []
    };
    const givenProject = {
        "id": "0001",
        "name": "Information statement",
        "datasetId": "0004",
        "numberTagToDo": 10,
        "createDate": new Date("04-04-2011").getTime(),
        "annotationType": "NER",
        "text": "Enim ad ex voluptate culpa non cillum eu mollit nulla ex pariatur duis. Commodo officia deserunt elit sint officia consequat elit laboris tempor qui est ex. Laborum magna id deserunt ut fugiat aute nulla in Lorem pariatur. Nostrud elit consectetur exercitation exercitation incididunt consequat occaecat velit voluptate nostrud sunt. Consectetur velit eu amet minim quis sunt in.",
        "labels": [{"name": "Recto", "color": "#212121", "id": 0}, {
            "name": "Verso",
            "color": "#ffbb00",
            "id": 1
        }, {"name": "Signature", "color": "#f20713", "id": 2}],
    };

    const group = {
        "id": "0001",
        "name": "developers",
        "userIds": ["0001", "0002"]
    };
    const users = [
        {
            id: "0001",
            "email": "guillaume.chervet@axa.fr",
            "nameIdentifier": "S000007"
        },
        {
            id: "0002",
            "email": "lilian.delouvy@axa.fr",
            "nameIdentifier": "S000005"
        }
    ];
    const annotationStatus = {
        isAnnotationClosed: true,
        numberAnnotationsByUsers: [{"nameIdentifier": "S000005", numberAnnotations: 15}, {
            "nameIdentifier": "S000007",
            numberAnnotations: 35
        }],
        numberAnnotationsDone: 46,
        numberAnnotationsToDo: 288,
        percentageNumberAnnotationsDone: 32
    };
    describe('PageContainer traduction', () => {
        const renderComponentAndCheckSnapshot = async() => {
            const givenFetch = jest.fn()
                .mockResolvedValueOnce({ok: true, status: 200, json: () => Promise.resolve(givenProject)})
                .mockResolvedValueOnce({ok: true, status: 200, json: () => Promise.resolve(givenDataset)})
                .mockResolvedValueOnce({ok: true, status: 200, json: () => Promise.resolve(group)})
                .mockResolvedValueOnce({ok: true, status: 200, json: () => Promise.resolve(users)})
                .mockResolvedValueOnce({ok: true, status: 200, json: () => Promise.resolve(annotationStatus)})
            const {asFragment, getByText} = render(<Router><PageContainer fetch={givenFetch}
                                                              user={{roles: [DataScientist]}}/></Router>);
            const messageEl = await waitFor(() => getByText('02/01/0001'));
            expect(messageEl).toHaveTextContent(
                '02/01/0001'
            );
            expect(asFragment()).toMatchSnapshot();
        };
        it('should render correctly in english', async () => {
            changeProjectTranslationLanguage('en');
            await renderComponentAndCheckSnapshot();
        });
        it('should render correctly in french', async () => {
            changeProjectTranslationLanguage('fr');
            await renderComponentAndCheckSnapshot();
        });
    });
    it('should display forbidden message when trying to get unauthorized projects', async () => {
        changeProjectTranslationLanguage('en');
        const givenFetch = () => {
            return {
                status: 403
            }
        };
        const {getByText} = render(<Router><PageContainer fetch={givenFetch}
                                                          user={{roles: [DataScientist]}}/></Router>);
        const messageEl = await waitFor(() => getByText(/allowed/i));
        expect(messageEl).toHaveTextContent(
            'allowed'
        );
    });
    it('should display error message when calling projects incorrectly', async () => {
        changeProjectTranslationLanguage('en');
        const givenFetch = () => {
            return {
                status: 500
            }
        };
        const {getByText} = render(<Router><PageContainer fetch={givenFetch}
                                                          user={{roles: [DataScientist]}}/></Router>);
        const messageEl = await waitFor(() => getByText(/investigation/i));
        expect(messageEl).toHaveTextContent(
            'investigation'
        );
    });
    it('should display forbidden message when trying to get unauthorized datasets or annotations status', async () => {
        changeProjectTranslationLanguage('en');
        const givenFetch = jest.fn()
            .mockResolvedValueOnce({ok: true, status: 200, json: () => Promise.resolve(givenProject)})
            .mockResolvedValueOnce({ok: false, status: 403});
        const {getByText} = render(<Router><PageContainer fetch={givenFetch}
                                                          user={{roles: [DataScientist]}}/></Router>);
        const messageEl = await waitFor(() => getByText(/allowed/i));
        expect(messageEl).toHaveTextContent(
            'allowed'
        );
    });
    it('should display error message when calling datasets or annotations status incorrectly', async () => {
        changeProjectTranslationLanguage('en');
        const givenFetch = jest.fn()
            .mockResolvedValueOnce({ok: true, status: 200, json: () => Promise.resolve(givenProject)})
            .mockResolvedValueOnce({ok: false, status: 500})
            .mockResolvedValueOnce({ok: false, status: 500})
            .mockResolvedValueOnce({ok: false, status: 500})
            .mockResolvedValueOnce({ok: false, status: 500});
        const {getByText} = render(<Router><PageContainer fetch={givenFetch}
                                                          user={{roles: [DataScientist]}}/></Router>);
        const messageEl = await waitFor(() => getByText(/investigation/i));
        expect(messageEl).toHaveTextContent(
            'investigation'
        );
    });

    describe('.reducer()', () => {
        changeProjectTranslationLanguage('en');
        it('should set the new fields with asked values after onChange action', () => {
            const givenState = {...initialState};
            const givenAction = {
                type: 'init',
                data: {
                    project: givenProject,
                    dataset: givenDataset,
                    group: {},
                    annotationsStatus: {},
                    status: resilienceStatus.LOADING,
                    users: {}
                }
            }

            const actualState = reducer(givenState, givenAction);

            expect(actualState).toMatchObject({
                ...givenState,
                status: resilienceStatus.LOADING,
                project: givenProject,
                dataset: givenDataset,
                annotationsStatus: {},
                users: {},
                group: {},
            });
        });
        it('should open modal', () => {
            const givenState = {...initialState};
            const givenAction = {
                type: 'open_modal',
                data: {isModalOpened: true}
            };

            const actualState = reducer(givenState, givenAction);

            expect(actualState).toMatchObject({
                ...givenState,
                isModalOpened: true
            });
        });
        it('should lock project and start', () => {
            const givenState = {...initialState};
            const givenAction = {
                type: 'lock_project_start'
            };

            const actualState = reducer(givenState, givenAction);

            expect(actualState).toMatchObject({
                ...givenState,
                status: resilienceStatus.POST,
                isModalOpened: false
            });
        });
        it('should update status', () => {
            const givenState = {...initialState};
            const givenAction = {
                type: 'update_status',
                data: {status: resilienceStatus.SUCCESS}
            };

            const actualState = reducer(givenState, givenAction);

            expect(actualState).toMatchObject({
                ...givenState,
                status: resilienceStatus.SUCCESS,
                isModalOpened: false
            });
        })
        it('should throw an error by default', (done) => {
            const givenState = {};
            const givenAction = {
                type: 'unknown',
            }

            try {
                reducer(givenState, givenAction);
                fail(error);
            } catch (error) {
                done();
            }
        });
    });

    describe('.onLockSubmit', () => {

        const testCases = [
            [403, resilienceStatus.FORBIDDEN],
            [500, resilienceStatus.ERROR]
        ];

        it('should fetch delete project method', async () => {
            const givenFetch = jest.fn()
                .mockResolvedValueOnce({ok: true, status: 200});
            const givenDispatch = jest.fn();
            const givenHistory = {push: jest.fn()}
            await onLockSubmit(givenFetch, givenDispatch, givenHistory)("0001");
            expect(givenDispatch).toHaveBeenNthCalledWith(1, {type: 'lock_project_start'});
            expect(givenDispatch).toHaveBeenNthCalledWith(2, {
                type: 'update_status',
                data: {status: resilienceStatus.SUCCESS}
            });
            expect(givenHistory.push).toHaveBeenCalledWith("/projects");
        });

        test.each(testCases)(
            "given %p response on deletion fetch, should return related resilience status",
            async (fetchStatus, expectedStatus) => {
                const givenFetch = jest.fn()
                    .mockResolvedValueOnce({status: fetchStatus});
                const givenDispatch = jest.fn();
                const givenHistory = {push: jest.fn()};
                await onLockSubmit(givenFetch, givenDispatch, givenHistory)("0001");
                expect(givenDispatch).toHaveBeenNthCalledWith(1, {type: 'lock_project_start'});
                expect(givenDispatch).toHaveBeenNthCalledWith(2, {
                    type: 'update_status',
                    data: {status: expectedStatus}
                });
            }
        );
    });
});

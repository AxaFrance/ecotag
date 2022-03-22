import '@testing-library/jest-dom/extend-expect';
import React from 'react';
import { render, waitFor } from '@testing-library/react';
import {init, initialState, PageContainer, reducer} from './Page.container';
import {BrowserRouter as Router} from "react-router-dom";
import {resilienceStatus} from "../../shared/Resilience";

function fail(message = "The fail function was called") {
  throw new Error(message);
}

describe('Page.container', () => {
  const givenUser = {};
  const givenDataset = {
    "id": "0001",
    "name": "Carte verte",
    "type": "Image",
    "numberFiles": 300,
    "createDate": new Date("10-30-2019").getTime(),
    files: []
  };
  const givenProject = {
    "id": "0001",
    "name": "Relevé d'information",
    "dataSetId": "0004",
    "numberTagToDo": 10,
    "createDate": new Date("04-04-2011").getTime(),
    "typeAnnotation": "NER",
    "text": "Enim ad ex voluptate culpa non cillum eu mollit nulla ex pariatur duis. Commodo officia deserunt elit sint officia consequat elit laboris tempor qui est ex. Laborum magna id deserunt ut fugiat aute nulla in Lorem pariatur. Nostrud elit consectetur exercitation exercitation incididunt consequat occaecat velit voluptate nostrud sunt. Consectetur velit eu amet minim quis sunt in.",
    "labels": [{"name": "Recto", "color": "#212121", "id": 0}, {"name": "Verso", "color": "#ffbb00", "id": 1}, {"name": "Signature", "color": "#f20713", "id": 2}],
    "users": [
      {"annotationCounter": 10,
        "annotationToBeVerified": 1,
        "email": "clement.trofleau.lbc@axa.fr"},
      {"annotationCounter": 24,
        "annotationToBeVerified": 5,
        "email": "Guillaume.chervet@axa.fr"},
      {"annotationCounter": 35,
        "annotationToBeVerified": 15,
        "email": "Gilles.Cruchon@axa.fr"}
    ]
  };
  it('PageContainer render correctly', async () => {
    const givenFetch = jest.fn()
        .mockResolvedValueOnce({ok: true, status: 200, json: () => Promise.resolve(givenProject)})
        .mockResolvedValueOnce({ok: true, status: 200, json: () => Promise.resolve(givenDataset)})
        .mockResolvedValueOnce({ok: true, status: 200, json: () => Promise.resolve({})})
    const { getByText } = render(<Router><PageContainer fetch={givenFetch} user={givenUser}/></Router>);
    const messageEl = await waitFor(() => getByText('02/01/0001'));
    expect(messageEl).toHaveTextContent(
        '02/01/0001'
    );
  });

  describe('.reducer()', () => {
    it('should set the new fields with asked values after onChange action', () => {
      const givenState = {...initialState};
      const givenAction = {
        type: 'init',
        data: {
          project : givenProject,
          dataset: givenDataset,
          group: {},
          status: resilienceStatus.LOADING
        }
      }

      const actualState = reducer(givenState, givenAction);

      expect(actualState).toMatchObject({
        ...givenState,
        status: resilienceStatus.LOADING,
        project : givenProject,
        dataset: givenDataset
      });
    });
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

  describe('.init()', () => {
    let givenFetch;
    let givenDispatch;
    let givenFetchRejected;
    
    beforeEach(() => {
      givenFetch = jest.fn();
      givenDispatch = jest.fn();
      givenFetchRejected = jest.fn(() => Promise.reject("ERROR"));
    });
    afterEach(() => {
      jest.clearAllMocks();
    });
    
    it('should call init and dispatch', async () => {
      givenFetch= jest.fn()
          .mockResolvedValueOnce({ok: true, status: 200, json: () => Promise.resolve(givenProject)})
          .mockResolvedValueOnce({ok: true, status: 200, json: () => Promise.resolve(givenDataset)})
          .mockResolvedValueOnce({ok: true, status: 200, json: () => Promise.resolve({})})
      try {
        await init(givenFetch, givenDispatch)(givenProject.id);
        expect(givenDispatch).toHaveBeenCalledWith( { type: "init", data: { project: givenProject, dataset: givenDataset, group: {}, status: resilienceStatus.SUCCESS } });
      } catch (error) {
        fail(error);
      }
    });

    it('should fail because of error during init', async () => {
      try {
        await init(givenFetch, givenDispatch);
        fail(error);
      } catch (error) {
        expect(givenFetch).toHaveBeenCalledTimes(0);
      }
    });
  });
});


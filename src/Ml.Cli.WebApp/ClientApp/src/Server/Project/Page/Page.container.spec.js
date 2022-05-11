import '@testing-library/jest-dom/extend-expect';
import React from 'react';
import { render, waitFor } from '@testing-library/react';
import {initialState, onLockSubmit, PageContainer, reducer} from './Page.container';
import {BrowserRouter as Router} from "react-router-dom";
import {resilienceStatus} from "../../shared/Resilience";
import {DataScientist} from "../../withAuthentication";

function fail(message = "The fail function was called") {
  throw new Error(message);
}

describe('Page.container', () => {
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
    "datasetId": "0004",
    "numberTagToDo": 10,
    "createDate": new Date("04-04-2011").getTime(),
    "annotationType": "NER",
    "text": "Enim ad ex voluptate culpa non cillum eu mollit nulla ex pariatur duis. Commodo officia deserunt elit sint officia consequat elit laboris tempor qui est ex. Laborum magna id deserunt ut fugiat aute nulla in Lorem pariatur. Nostrud elit consectetur exercitation exercitation incididunt consequat occaecat velit voluptate nostrud sunt. Consectetur velit eu amet minim quis sunt in.",
    "labels": [{"name": "Recto", "color": "#212121", "id": 0}, {"name": "Verso", "color": "#ffbb00", "id": 1}, {"name": "Signature", "color": "#f20713", "id": 2}],
  };
  
  const group = {
    "id": "0001",
        "name": "developpeurs",
        "userIds": ["0001", "0002"]
  };
  const users = [
    {
      id: "0001",
      "email":"guillaume.chervet@axa.fr",
      "nameIdentifier": "S000007"
    },
    {
      id: "0002",
      "email":"lilian.delouvy@axa.fr",
      "nameIdentifier": "S000005"
    }
  ];
  const annotationStatus= {
    isAnnotationClosed: true,
    numberAnnotationsByUsers: [{"nameIdentifier": "S000005", numberAnnotations: 15 }, {"nameIdentifier": "S000007", numberAnnotations: 35 }],
    numberAnnotationsDone: 46,
    numberAnnotationsToDo: 288,
    percentageNumberAnnotationsDone:32
  };
  it('PageContainer render correctly', async () => {
    const givenFetch = jest.fn()
        .mockResolvedValueOnce({ok: true, status: 200, json: () => Promise.resolve(givenProject)})
        .mockResolvedValueOnce({ok: true, status: 200, json: () => Promise.resolve(givenDataset)})
        .mockResolvedValueOnce({ok: true, status: 200, json: () => Promise.resolve(group)})
        .mockResolvedValueOnce({ok: true, status: 200, json: () => Promise.resolve(users)})
        .mockResolvedValueOnce({ok: true, status: 200, json: () => Promise.resolve(annotationStatus)})
    const { getByText } = render(<Router><PageContainer fetch={givenFetch} user={{roles: [DataScientist]}}/></Router>);
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
          annotationsStatus: {},
          status: resilienceStatus.LOADING,
          users: {}
        }
      }

      const actualState = reducer(givenState, givenAction);

      expect(actualState).toMatchObject({
        ...givenState,
        status: resilienceStatus.LOADING,
        project : givenProject,
        dataset: givenDataset,
        annotationsStatus: {},
        users: {},
        group: {},
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
  
  describe('.onLockSubmit', () => {
    it('should fetch delete project method', async () => {
      const givenFetch = jest.fn()
          .mockResolvedValueOnce({ok: true, status: 200});
      const givenDispatch = jest.fn();
      const givenHistory = {push:jest.fn()}
      await onLockSubmit(givenFetch, givenDispatch, givenHistory)("0001");
      expect(givenDispatch).toHaveBeenNthCalledWith(1, { type: 'lock_project_start'});
      expect(givenDispatch).toHaveBeenNthCalledWith(2, {type: 'lock_project', data: {status: resilienceStatus.SUCCESS}});
      expect(givenHistory).toHaveBeenCalledWith("/projects");
    });
  });
});

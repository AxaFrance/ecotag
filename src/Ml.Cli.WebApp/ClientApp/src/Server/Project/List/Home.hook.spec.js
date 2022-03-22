
import '@testing-library/jest-dom/extend-expect';
import React from 'react';
import { act } from 'react-dom/test-utils';
import { init, useHome } from './Home.hook';
import { initialState } from './Home.reducer';
import {resilienceStatus} from "../../shared/Resilience";

describe('Home.hook for projects', () => {

  let givenFetch;
  let givenDispatch;
  let givenFetchRejected;

  const givenProjects = [{
    "id": "0001",
    "name": "Relevé d'information",
    "groupId": "0001",
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
        "email": "Gille.Cruchont@axa.fr"}
    ]
  }];
  
  const givenGroups = [{
    "id": "0001",
    "name": "groupName"
  }];

  function fail(message = "The fail function was called") {
    throw new Error(message);
  }

  beforeEach(() => {
    givenFetch = jest.fn()
        .mockImplementationOnce(() => Promise.resolve({ok: true, json: () => Promise.resolve(givenProjects)}))
        .mockImplementationOnce(() => Promise.resolve({ok: true, json: () => Promise.resolve(givenGroups)}));
    givenDispatch = jest.fn();
    givenFetchRejected = jest.fn(() => Promise.reject("ERROR"));
  });
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('.init()', () => {
    it('should call fetchProjects and dispatch', async () => { 
      try {
        await init(givenFetch, givenDispatch)();
        expect(givenDispatch).toHaveBeenCalledWith( { type: "init", data : { items: givenProjects, groups: givenGroups, status: resilienceStatus.SUCCESS } } );
      } catch (error) {
        fail(error);
      }
    });

    it('should fail because of error during fetchProjects', async () => {
      try {
        await init(givenFetchRejected, givenDispatch)();
        fail(error);
      } catch (error) {
        expect(givenFetchRejected).toHaveBeenCalled();
        expect(givenDispatch).toHaveBeenCalledTimes(0);
      }
    });
  });
  
  describe('.useHome()', () => {
    const givenDispatch = jest.fn();
    beforeEach(() => {
      const givenState = { ...initialState };
      jest
        .spyOn(React, 'useReducer')
        .mockImplementation(() => [givenState, givenDispatch]);
      jest.spyOn(React, 'useEffect').mockImplementation(() => jest.fn());
    });

    it('should build a valid hook useHome', async () => {
      let actualHook = {};
      await act(async () => {
        actualHook = await useHome(givenFetch);

        const expectedHook = {
          state: expect.any(Object),
          onChangePaging: expect.any(Function),
          onChangeFilter: expect.any(Function),
          onChangeSort: expect.any(Function)
        };
        expect(actualHook).toMatchObject(expectedHook);
        actualHook.onChangePaging({numberItems: 10, page: 1});
        actualHook.onChangeFilter('filterValue');
        actualHook.onChangeSort('name')();
        expect(givenDispatch).toBeCalledTimes(3);
      });
    });
  });
});


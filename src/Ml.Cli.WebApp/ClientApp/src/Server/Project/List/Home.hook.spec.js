
import '@testing-library/jest-dom/extend-expect';
import React from 'react';
import { act } from 'react-dom/test-utils';
import { deleteProject, init, useHome } from './Home.hook';
import { initialState } from './Home.reducer';
import * as HomeService from './Home.service';

describe('Home.hook for projects', () => {

  let givenFetch;
  let givenDispatch;
  let spyFetchProjects;
  let givenFetchRejected;

  const givenProjects = [{
    "id": "0001",
    "name": "Relevé d'information",
    "dataSetId": "0004",
    "classification": "Publique",
    "numberTagToDo": 10,
    "createDate": "04/04/2011",
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

  beforeEach(() => {
    givenFetch = jest.fn();
    givenDispatch = jest.fn();
    givenFetchRejected = jest.fn(() => Promise.reject("ERROR"));
    spyFetchProjects = jest.spyOn(
        HomeService,
      'fetchProjects'
    );
    spyFetchProjects.mockReturnValue(() =>
      Promise.resolve(givenProjects)
    );
  });
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('.init()', () => {
    it('should call fetchProjects and dispatch', async () => { 
      try {
        await init(givenFetch, givenDispatch)();
        expect(spyFetchProjects).toHaveBeenCalled();
        expect(givenDispatch).toHaveBeenCalledWith( { type: "init", data : { items: givenProjects } } );
      } catch (error) {
        fail(error);
      }
    });

    it('should fail because of error during fetchProjects', async () => { 
      // given
      spyFetchProjects.mockReturnValue(() =>
        Promise.reject('ERROR')
      );
      try {
        await init(givenFetchRejected, givenDispatch)();
        fail(error);
      } catch (error) {
        expect(spyFetchProjects).toHaveBeenCalled();
        expect(givenDispatch).toHaveBeenCalledTimes(0);
      }
    });
  });

  describe('.deleteProject()', () => {
    const givenProjectId = "0001";
    const DELETE_GROUP_ROUTE = `projects/${givenProjectId}`;
    const givenFetch = jest.fn(() => Promise.resolve());
    it('should call fetchDeleteProject and dispatch', async () => { 
      try {
        await deleteProject(givenFetch, givenDispatch)(givenProjectId);
        expect(givenFetch).toHaveBeenCalledWith(DELETE_GROUP_ROUTE, {
          method:'DELETE'
        });
        expect(givenDispatch).toHaveBeenCalledWith( { type: "onActionProjectsLoading" });
      } catch (error) {
        fail(error);
      }
    });

    it('should fail because of error during deleteGroup', async () => { 
      try {
        await deleteProject(givenFetchRejected, givenDispatch)(givenProjectId);
        fail(error);
      } catch (error) {
        expect(givenFetch).toHaveBeenCalledTimes(0);
        expect(givenDispatch).toHaveBeenCalledWith( { type: "onActionProjectsLoading" });
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
      // given
      let actualHook = {};
      await act(async () => {
        actualHook = await useHome(givenFetch);

        const expectedHook = {
          state: expect.any(Object),
          onChangePaging: expect.any(Function),
          onChangeFilter: expect.any(Function),
          onChangeSort: expect.any(Function),
          onDeleteProject: expect.any(Function),
        };
        expect(actualHook).toMatchObject(expectedHook);
        actualHook.onChangePaging({numberItems: 10, page: 1});
        actualHook.onChangeFilter('filterValue');
        actualHook.onChangeSort('name')();
        actualHook.onDeleteProject('id');
        expect(givenDispatch).toBeCalledTimes(4);
      });
    });
  });
});


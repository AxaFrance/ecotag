import '@testing-library/jest-dom/extend-expect';
import React from 'react';
import {resilienceStatus} from "../../shared/Resilience";
import {init, initialState} from "./Annotation.hook";
import {reducer} from "./Annotation.reducer";

const fetch = () => Promise.resolve({
  "id": "0001",
  "name": "Relevé d'information",
  "datasetId": "0004",
  "numberTagToDo": 10,
  "createDate": "04/04/2011",
  "annotationType": "NER",
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
});

describe('AnnotationDispatch.container', () => {
  const givenUser = {};
  const givenDataset = {
    "id": "0001",
    "name": "Carte verte",
    "type": "Image",
    "numberFiles": 300,
    "createDate": "30/10/2019"
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
  };

  function fail(message = "The fail function was called") {
    throw new Error(message);
  }

  describe('.reducer()', () => {
    it('should set the new fields with asked values after onChange action', () => {
      const givenState = {...initialState};
      const givenAction = {
        type: 'init',
        data: {
          project : givenProject,
          status: resilienceStatus.LOADING
        }
      }

      const actualState = reducer(givenState, givenAction);

      expect(actualState).toMatchObject({
        ...givenState,
        project : givenProject,
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
    
    beforeEach(() => {
      givenDispatch = jest.fn();
    });
    afterEach(() => {
      jest.clearAllMocks();
    });
    
    it('should call init and dispatch', async () => {
      givenFetch = jest.fn(() => Promise.resolve({ok: true, json: () => Promise.resolve(givenProject)}));
      try {
        await init(givenFetch, givenDispatch)(givenProject.id);
        expect(givenDispatch).toHaveBeenCalledWith( { type: "init", data: { project: givenProject, status: resilienceStatus.SUCCESS } });
      } catch (error) {
        fail(error);
      }
    });

    it('should fail because of error during init', async () => {
      givenFetch = jest.fn(() => Promise.resolve({ok: true, json: () => Promise.resolve(givenProject)}));
      try {
        await init(givenFetch, givenDispatch);
        fail(error);
      } catch (error) {
        expect(givenFetch).toHaveBeenCalledTimes(0);
      }
    });
    
    describe('resilience fail', () => {
      const testCases = [
        [403, resilienceStatus.FORBIDDEN],
        [500, resilienceStatus.ERROR]
      ];
      
      test.each(testCases)(
          "given %p fetch project response, should return related resilience status",
          async (fetchStatus, expectedStatus) => {
            givenFetch = jest.fn(() => Promise.resolve({status: fetchStatus}));
            try{
              await init(givenFetch, givenDispatch)(givenProject.id);
              expect(givenDispatch).toHaveBeenCalledWith({type: 'init', data: {project: null, status: expectedStatus}});
            } catch(error){
              fail(error);
            }
          }
      )
    });
  });
});


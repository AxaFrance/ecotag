import '@testing-library/jest-dom/extend-expect';
import React from 'react';
import { render, waitFor } from '@testing-library/react';
import {createProject, initState, NewContainer, reducer} from './New.container';
import {BrowserRouter as Router} from "react-router-dom";
import {DATASET, GROUP, LABELS, MSG_REQUIRED, NAME, NUMBER_CROSS_ANNOTATION, TYPE} from "./constants";

const givenGroups = [
  {
    "id": "0001",
    "name": "developpeurs",
    "users": [
      { "email": "clement.trofleau.lbc@axa.fr" },
      { "email": "gilles.cruchon@axa.fr" },
      { "email": "francois.descamps@axa.fr" },
      { "email": "guillaume.chervet@axa.fr" }
    ]
  }
];

const telemetry = { trackEvent : (eventName) => console.log(eventName) }

const fetch = () => {
  return {ok: true, json: () => Promise.resolve({
      "id": "0001",
      "name": "Relevé d'information",
      "datasetId": "0004",
      "numberTagToDo": 10,
      "createDate": new Date("04-04-2011").getTime(),
      "annotationType": "NER",
      "text": "Enim ad ex voluptate culpa non cillum eu mollit nulla ex pariatur duis. Commodo officia deserunt elit sint officia consequat elit laboris tempor qui est ex. Laborum magna id deserunt ut fugiat aute nulla in Lorem pariatur. Nostrud elit consectetur exercitation exercitation incididunt consequat occaecat velit voluptate nostrud sunt. Consectetur velit eu amet minim quis sunt in.",
      "labels": [{"name": "Recto", "color": "#212121", "id": "0"}, {"name": "Verso", "color": "#ffbb00", "id": "1"}, {"name": "Signature", "color": "#f20713", "id": "2"}],
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
    })};
};

describe('New.container', () => {
  it('NewContainer render correctly', async () => {
    const { container, getAllByText } = render(<Router><NewContainer groups={givenGroups} fetch={fetch} /></Router>);
    await waitFor(() => expect(container.querySelector(".af-spinner--active")).toBeNull());
    await waitFor(() => getAllByText(/Nouveau projet d'annotation/i));
  });

  describe('New.reducer', () => {
    it('should set the new fields with asked values after onChange action', () => {
      const givenState = {...initState};
      const givenAction = {
        type: 'onChange',
        event: {
          name: 'NAME',
          value: 'toto'
        }
      }

      const actualState = reducer(givenState, givenAction);

      expect(actualState).toMatchObject({
        ...givenState,
        fields: {
          [NAME]: { name: NAME, value: 'toto', message: null },
          [DATASET]: { name: DATASET, value: '', message: MSG_REQUIRED },
          [GROUP]: { name: GROUP, value: '', message: MSG_REQUIRED },
          [TYPE]: { name: TYPE, value: '', message: MSG_REQUIRED, options: [] },
          [NUMBER_CROSS_ANNOTATION]: { name: NUMBER_CROSS_ANNOTATION, value: null, message: MSG_REQUIRED },
          [LABELS]: { name: LABELS, values: [], message: MSG_REQUIRED },
        }
      });
    });
    it('should set the hasSubmit on true after onSubmit action', () => {
      const givenState = {};
      const givenAction = {
        type: 'onSubmit',
      }

      const actualState = reducer(givenState, givenAction);

      expect(actualState).toMatchObject({
        hasSubmit: true,
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

  describe('.createProject()', () => {
    let givenHistory;
    let givenFetch;
    let givenDispatch;
    let givenFetchRejected;
    const givenState = { 
      ...initState,
      fields: {
        [NAME]: { name: NAME, value: 'toto', message: null },
        [DATASET]: { name: DATASET, values: [], message: null },
        [GROUP]: { name: GROUP, value: '', message: null },
        [TYPE]: { name: TYPE, value: 'NER', message: null },
        [NUMBER_CROSS_ANNOTATION]: { name: NUMBER_CROSS_ANNOTATION, value: null, message: null },
        [LABELS]: { name: LABELS, values: [], message: null },
      }
    };
    function fail(message = "The fail function was called") {
      throw new Error(message);
    }
    
    beforeEach(() => {
      givenHistory = [];
      givenFetch = jest.fn(() => Promise.resolve({ok: true, json: () => Promise.resolve({value: "something"})}));
      givenDispatch = jest.fn();
      givenFetchRejected = jest.fn(() => Promise.reject("ERROR"));
    });
    afterEach(() => {
      jest.clearAllMocks();
    });
    
    it('should call createProject and dispatch', async () => {
      try {
        await createProject(givenHistory, givenFetch, givenState, givenDispatch, telemetry);
        expect(givenFetch).toHaveBeenCalledTimes(1);
        expect(givenDispatch).toHaveBeenCalledWith( { type: "onSubmit" });
      } catch (error) {
        fail(error);
      }
    });

    it('should fail because of error during createProject', async () => {
      try {
        await createProject(givenHistory, givenFetch, givenState, givenDispatch, telemetry);
        fail(error);
      } catch (error) {
        expect(givenFetch).toHaveBeenCalledTimes(1);
        expect(givenDispatch).toHaveBeenCalledWith( { type: "onSubmit" });
      }
    });
  });
});


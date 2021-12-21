import '@testing-library/jest-dom/extend-expect';
import React from 'react';
import { render, waitFor } from '@testing-library/react';
import {init, initialState, AnnotationDispatchContainer, reducer} from './AnnotationDispatch.container';
import {BrowserRouter as Router} from "react-router-dom";
import * as PageService from "../Page/Page.service";

const fetch = () => Promise.resolve({
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
});

describe('AnnotationDispatch.container', () => {
  const givenUser = {};
  const givenDataset = {
    "id": "0001",
    "name": "Carte verte",
    "type": "Image",
    "classification": "Publique",
    "numberFiles": 300,
    "createDate": "30/10/2019"
  };
  const givenProject = {
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
  };
  /*it('AnnotationDispatchContainer render correctly', async () => {
    const { getByText } = render(<Router><AnnotationDispatchContainer fetch={fetch} user={givenUser}/></Router>);
    const messageEl = await waitFor(() => getByText('Soumettre l\'annotation'));
    expect(messageEl).toHaveTextContent(
        'Soumettre l\'annotation'
    );
  });*/

  describe('.reducer()', () => {
    it('should set the new fields with asked values after onChange action', () => {
      const givenState = {...initialState};
      const givenAction = {
        type: 'init',
        data: {
          project : givenProject,
        }
      }

      const actualState = reducer(givenState, givenAction);

      expect(actualState).toMatchObject({
        ...givenState,
        loading: false,
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
    let spyFetchProjects;
    let givenFetchRejected;
    
    beforeEach(() => {
      givenFetch = jest.fn();
      givenDispatch = jest.fn();
      givenFetchRejected = jest.fn(() => Promise.reject("ERROR"));
      spyFetchProjects = jest.spyOn(
          PageService,
          'fetchProject'
      );
      spyFetchProjects.mockReturnValue(() =>
          Promise.resolve(givenProject)
      );
    });
    afterEach(() => {
      jest.clearAllMocks();
    });
    
    it('should call init and dispatch', async () => {
      try {
        await init(givenFetch, givenDispatch)(givenProject.id);
        expect(spyFetchProjects).toHaveBeenCalled();
        expect(givenDispatch).toHaveBeenCalledWith( { type: "init", data: { project: givenProject } });
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


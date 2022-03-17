import { initialState, reducer } from './Home.reducer';
import {resilienceStatus} from "../../shared/Resilience";

describe('Home.reducer', () => {
  describe('.reducer()', () => {
    const givenProjects = [{
      "id": "0001",
      "name": "Relevé d'information",
      "dataSetId": "0004",
      "groupId": "0001",
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
    }];
    const givenGroups = [{
      id: "0001",
      "name": "groupName"
    }];
    it('should init state with groups after init action', () => {
      const givenState = {};
      const givenAction = {
        type: 'init',
        data : {
          items: givenProjects,
          groups: givenGroups,
          status: resilienceStatus.LOADING
        }
      };
      const expectedProjects = [...givenProjects];
      expectedProjects[0].groupName = "groupName";
      
      const actualState = reducer(givenState, givenAction);

      expect(actualState).toMatchObject({
        items: expectedProjects,
        status: resilienceStatus.LOADING
      });
    });
    
    it('should set the loading on true after onActionProjectsLoading action', () => {
      const givenState = {};
      const givenAction = {
        type: 'onActionProjectsLoading',
      }

      const actualState = reducer(givenState, givenAction);

      expect(actualState).toMatchObject({
        loading: resilienceStatus.LOADING,
      });
    });

    it('should set the state with the paging data after onChangePaging action', () => {
      const givenState = {...initialState};
      const givenAction = {
        type: 'onChangePaging',
        data : {
          numberItems: 10, 
          page: 1
        }
      };

      const actualState = reducer(givenState, givenAction);

      expect(actualState).toMatchObject({
        filters : {
          ...initialState.filters,
          paging: {
            numberItemsByPage: 10,
            currentPage: 1,
          }
        }
      });
    });

    it('should set the state with the filter data after onChangeFilter action', () => {
      const givenState = {...initialState};
      const givenAction = {
        type: 'onChangeFilter',
        data : {
          filterValue: "myFilter"
        }
      };

      const actualState = reducer(givenState, givenAction);

      expect(actualState).toMatchObject({
        filters: {
          ...givenState.filters,
          ...givenState.paging,
          filterValue: "myFilter",
        }
      });
    });

    it('should set the state with the filter data after onChangeFilter action in case of no value in filter', () => {
      const givenState = {...initialState};
      const givenAction = {
        type: 'onChangeFilter',
        data : {}
      };

      const actualState = reducer(givenState, givenAction);

      expect(actualState).toMatchObject({
        filters: {
          ...givenState.filters,
          ...givenState.paging,
        }
      });
    });

    it('should set the state with the filter data after onChangeSort action', () => {
      const givenState = {...initialState, items: givenProjects};
      const givenAction = {
        type: 'onChangeSort',
        data : {
          propertyName: "name"
        }
      };

      const actualState = reducer(givenState, givenAction);

      expect(actualState).toMatchObject({
        filters: {
          ...givenState.filters,
          ...givenState.paging,
        }
      });
    });

    it('should set the state with the filter data after onChangeSort action with asc chosen', () => {
      const givenState = {
        ...initialState,
        items: givenProjects,
        columns :{
          name : { value: "asc", timeLastUpdate : null},
          createDate: { value: null, timeLastUpdate : null},
          typeAnnotation: { value: null, timeLastUpdate : null},
          numberTagToDo: { value: null, timeLastUpdate : null}
        }
      };
      const givenAction = {
        type: 'onChangeSort',
        data : {
          propertyName: "name"
        }
      };

      const actualState = reducer(givenState, givenAction);

      expect(actualState).toMatchObject({
        filters: {
          ...givenState.filters,
          ...givenState.paging,
        }
      });
    });

    it('should set the state with the filter data after onChangeSort action with desc chosen', () => {
      const givenState = {
        ...initialState,
        items: givenProjects,
        columns :{
          name : { value: "desc", timeLastUpdate : null},
          createDate: { value: null, timeLastUpdate : null},
          typeAnnotation: { value: null, timeLastUpdate : null},
          numberTagToDo: { value: null, timeLastUpdate : null}
        }
      };
      const givenAction = {
        type: 'onChangeSort',
        data : {
          propertyName: "name"
        }
      };

      const actualState = reducer(givenState, givenAction);

      expect(actualState).toMatchObject({
        filters: {
          ...givenState.filters,
          ...givenState.paging,
        }
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
});

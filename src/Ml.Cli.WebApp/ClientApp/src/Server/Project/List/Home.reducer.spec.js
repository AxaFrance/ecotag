import { initialState, reducer } from './Home.reducer';
import {resilienceStatus} from "../../shared/Resilience";

describe('Home.reducer', () => {
  describe('.reducer()', () => {
    const givenProjects = [{
      "id": "0001",
      "name": "Relevé d'information",
      "datasetId": "0004",
      "groupId": "0001",
      "numberTagToDo": 10,
      "createDate": new Date("04-04-2011").getTime(),
      "annotationType": "NER"
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
          annotationType: { value: null, timeLastUpdate : null},
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
          annotationType: { value: null, timeLastUpdate : null},
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

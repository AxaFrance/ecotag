import { initialState, reducer } from './Home.reducer';
import {
  NAME
} from './New/constants';

describe('Home.reducer', () => {
  describe('.reducer()', () => {
    const givenGroups = [{
      "id": "0001",
      "name": "developpeurs",
      "users": [
        { "email": "clement.trofleau.lbc@axa.fr" },
        { "email": "gilles.cruchon@axa.fr" },
        { "email": "francois.descamps@axa.fr" },
        { "email": "guillaume.chervet@axa.fr" }
      ]
    }];
    it('should init state with groups', () => {
      const givenState = {};
      const givenAction = {
        type: 'init',
        data : {
          groups: givenGroups
        }
      }

      const actualState = reducer(givenState, givenAction);

      expect(actualState).toMatchObject({
        groups: givenGroups,
        users: undefined,
        status: undefined
      });
    });
    it('should set loading to true', () => {
      const givenState = {};
      const givenAction = {
        type: 'onActionGroupLoading',
      }

      const actualState = reducer(givenState, givenAction);

      expect(actualState).toMatchObject({
        status: "loading",
      });
    });
    it('should set loading to true and hasSubmit to false during a group creation', () => {
      const newGroup = {
        "id": "0001",
        "name": "developpeurs",
        "users": [
          { "email": "clement.trofleau.lbc@axa.fr" },
          { "email": "gilles.cruchon@axa.fr" },
          { "email": "francois.descamps@axa.fr" },
          { "email": "guillaume.chervet@axa.fr" }
        ]
      };
      
      const givenState = {groups: []};
      const givenAction = {
        type: 'onSubmitCreateGroup',
        data: {
          newGroup
        }
      };

      const actualState = reducer(givenState, givenAction);

      expect(actualState).toMatchObject({
        status: "success",
        hasSubmit: true,
        groups: [newGroup]
      });
    });
    it('should onChangeCreateGroup state during a group creation', () => {
      const givenState = Object.assign({}, initialState);
      const givenEvent = {
        "value": "abc",
        "name": NAME,
        "id": NAME
      };
      const givenAction = {
        type: 'onChangeCreateGroup',
        event: givenEvent
      }

      const actualState = reducer(givenState, givenAction);

      expect(actualState).toMatchObject({
        fields: {
          [NAME]: { name: NAME, value: givenEvent.value, message: null },
        }
      });
    });
    it('should onChangePaging state during a pagination', () => {
      const givenState = Object.assign({}, initialState);
      const givenAction = {
        type: 'onChangePaging',
        data: {
          numberItems: 50, 
          page : 2
        }
      }

      const actualState = reducer(givenState, givenAction);

      expect(actualState).toMatchObject({
        filters: {
          paging: {
            numberItemsByPage: 50,
            currentPage: 2,
          },
        },
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

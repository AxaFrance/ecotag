
import '@testing-library/jest-dom/extend-expect';
import React from 'react';
import { act } from 'react-dom/test-utils';
import { createGroup, deleteGroup, initListOfGroups, updateUsersInGroup, useHome } from './Home.hook';
import { initialState } from './Home.reducer';
import { FETCH_CONFIG } from '../Group.service';
import * as GroupService from '../Group.service';
import {
  NAME
} from './New/constants';

describe('Home.hook for groups', () => {

  let givenFetch;
  let givenDispatch;
  let spyFetchGroups;
  let givenFetchRejected;
  let spyFetchEligibleUsers;

  const GROUPS_ROUTE = "groups";
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
  const givenEligibleUsers = [
    {
      "email": "clement.trofleau.lbc@axa.fr",
    },
    {
      "email": "gilles.cruchon@axa.fr",
    },
    {
      "email": "francois.descamps@axa.fr",
    },
    {
      "email": "guillaume.chervet@axa.fr",
    },
  ];

  beforeEach(() => {
    givenFetch = jest.fn();
    givenDispatch = jest.fn();
    givenFetchRejected = jest.fn(() => Promise.reject("ERROR"));
    spyFetchGroups = jest.spyOn(
      GroupService,
      'fetchGroups'
    );
    spyFetchGroups.mockReturnValue(() =>
      Promise.resolve(givenGroups)
    );

    spyFetchEligibleUsers = jest.spyOn(
      GroupService,
      'fetchUsers'
    );
    spyFetchEligibleUsers.mockReturnValue(() =>
      Promise.resolve(givenEligibleUsers)
    );
  });
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('.initListOfGroups()', () => {
    it('should call fetchGroups and dispatch', async () => { 
      try {
        await initListOfGroups(givenFetch, givenDispatch)();
        expect(spyFetchGroups).toHaveBeenCalled();
        expect(spyFetchEligibleUsers).toHaveBeenCalled();
        expect(givenDispatch).toHaveBeenCalledWith( { type: "init", data : { items: givenGroups, eligibleUsers: givenEligibleUsers } } );
      } catch (error) {
        fail(error);
      }
    });

    it('should fail because of error during fetchGroups', async () => { 
      // given
      spyFetchGroups.mockReturnValue(() =>
        Promise.reject('ERROR')
      );
      try {
        await initListOfGroups(givenFetchRejected, givenDispatch)();
        fail(error);
      } catch (error) {
        expect(spyFetchGroups).toHaveBeenCalled();
        expect(givenDispatch).toHaveBeenCalledTimes(0);
      }
    });
  });

  describe('.deleteGroup()', () => {
    const givenGroupId = "0001";
    const DELETE_GROUP_ROUTE = `groups/${givenGroupId}`;
    const givenFetch = jest.fn(() => Promise.resolve());
    it('should call deleteGroup and dispatch', async () => { 
      try {
        await deleteGroup(givenFetch, givenDispatch)(givenGroupId);
        expect(givenFetch).toHaveBeenCalledWith(DELETE_GROUP_ROUTE, {
          method:'DELETE',
          ...FETCH_CONFIG
        });
        expect(givenDispatch).toHaveBeenCalledWith( { type: "onActionGroupLoading" });
      } catch (error) {
        fail(error);
      }
    });

    it('should fail because of error during deleteGroup', async () => { 
      try {
        await deleteGroup(givenFetchRejected, givenDispatch)(givenGroupId);
        fail(error);
      } catch (error) {
        expect(givenFetch).toHaveBeenCalledTimes(0);
        expect(givenDispatch).toHaveBeenCalledWith( { type: "onActionGroupLoading" });
      }
    });
  });

  describe('.createGroup()', () => {
    const givenFields = {
      [NAME]: { name: NAME, value: '002', message: null },
    }
    const givenFetch = jest.fn(() => Promise.resolve());
    it('should call createGroup and dispatch', async () => { 
      try {
        await createGroup(givenFetch, givenDispatch)(givenFields);
        expect(givenFetch).toHaveBeenCalledWith(
          GROUPS_ROUTE, {
            method:'POST',
            body: JSON.stringify({name:givenFields[NAME].value, users:[]}),
            ...FETCH_CONFIG
          }
        );
        expect(givenDispatch).toHaveBeenCalledTimes(3);
      } catch (error) {
        fail(error);
      }
    });

    it('should fail because of error during createGroup', async () => { 
      try {
        await createGroup(givenFetchRejected, givenDispatch)(givenFields);
        fail(error);
      } catch (error) {
        expect(givenFetchRejected).toHaveBeenCalled();
        expect(givenDispatch).toHaveBeenCalledTimes(1);
      }
    });
  });

  describe('.updateUsersInGroup()', () => {
    const givenState = { ...initialState };
    const givenIdGroup = '002';
    givenState.items = [
      {
        id: givenIdGroup,
        name: givenIdGroup,
        users: []
      }
    ];
    const givenUsers = [
      "jean.valjean@mine.fr"
    ];
    const givenFetch = jest.fn(() => Promise.resolve());
    it('should call updateUsersInGroup and dispatch', async () => { 
      try {
        await updateUsersInGroup(givenFetch, givenDispatch, givenState, givenIdGroup, givenUsers);
        expect(givenFetch).toHaveBeenCalledWith(
          GROUPS_ROUTE, {
            method:'POST',
            body: JSON.stringify({id: givenIdGroup, name:givenIdGroup, users:givenUsers.map(user => ({ email: user}))}),
            ...FETCH_CONFIG
          }
        );
        expect(givenDispatch).toHaveBeenCalledTimes(3);
      } catch (error) {
        fail(error);
      }
    });

    it('should fail because of error during updateUsersInGroup', async () => { 
      try {
        await updateUsersInGroup(givenFetchRejected, givenDispatch, givenState, givenIdGroup, givenUsers);
        fail(error);
      } catch (error) {
        expect(givenDispatch).toHaveBeenCalledTimes(1);
      }
    });
  });

  describe('.useHome()', () => {
    beforeEach(() => {
      const givenState = { ...initialState };
      jest
        .spyOn(React, 'useReducer')
        .mockImplementation(() => [givenState, jest.fn()]);
      jest.spyOn(React, 'useEffect').mockImplementation(() => jest.fn());
    });

    it('should build a valid hook useHome', async () => {
      // given
      let actualHook = {};
      await act(async () => {
        actualHook = await useHome(givenFetch);
      });
      const expectedHook = {
        state: expect.any(Object),
        onChangePaging: expect.any(Function), 
        onDeleteGroup: expect.any(Function), 
        onChangeCreateGroup: expect.any(Function),
        onSubmitCreateGroup: expect.any(Function),
      };
      expect(actualHook).toMatchObject(expectedHook);
    });
  });
});


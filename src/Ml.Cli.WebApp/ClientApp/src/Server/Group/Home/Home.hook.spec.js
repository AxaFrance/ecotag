
import '@testing-library/jest-dom/extend-expect';
import React from 'react';
import { act } from 'react-dom/test-utils';
import { createGroup, initListOfGroups, updateUsersInGroup, useHome } from './Home.hook';
import { initialState } from './Home.reducer';
import * as GroupService from '../Group.service';
import {
  NAME
} from './New/constants';

function fail(message = "The fail function was called") {
  throw new Error(message);
}

global.fail = fail;

describe('Home.hook for groups', () => {

  let givenFetch;
  let givenFetchWithData;
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
    givenFetchWithData = jest.fn().mockResolvedValue({status: 500, ok: true});
    givenFetchRejected = jest.fn(() => Promise.reject("ERROR"));
    spyFetchGroups = jest.spyOn(
      GroupService,
      'fetchGroups'
    );
    spyFetchGroups.mockReturnValue(() => {
          return {ok: true, json: () => Promise.resolve(givenGroups)};
    });

    spyFetchEligibleUsers = jest.spyOn(
      GroupService,
      'fetchUsers'
    );
    spyFetchEligibleUsers.mockReturnValue(() => {
      return {ok: true, json: () => Promise.resolve(givenEligibleUsers)};
    });
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
        expect(givenDispatch).toHaveBeenCalledWith( { type: "init", data : { groups: givenGroups, users: givenEligibleUsers, status: "success" } } );
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

  describe('.createGroup()', () => {
    const givenFields = {
      [NAME]: { name: NAME, value: '002', message: null },
    }
    it('should call createGroup and dispatch', async () => { 
      try {
        await createGroup(givenFetchWithData, givenDispatch)(givenFields);
        expect(givenFetchWithData).toHaveBeenCalledWith(
          GROUPS_ROUTE, {
            method:'POST',
            body: JSON.stringify({name:givenFields[NAME].value, users:[]})
          }
        );
        expect(givenDispatch).toHaveBeenCalledTimes(2);
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
    givenState.groups = [
      {
        id: givenIdGroup,
        name: givenIdGroup,
        users: []
      }
    ];
    const givenUsers = [
      "someUserId"
    ];
    it('should call updateUsersInGroup and dispatch', async () => { 
      try {
        await updateUsersInGroup(givenFetchWithData, givenDispatch, givenState, givenIdGroup, givenUsers);
        expect(givenFetchWithData).toHaveBeenCalledWith(
          GROUPS_ROUTE, {
            method:'PUT',
            body: JSON.stringify({id: givenIdGroup, name:givenIdGroup, users:givenUsers})
          }
        );
        expect(givenDispatch).toHaveBeenCalledTimes(2);
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
        onChangeCreateGroup: expect.any(Function),
        onSubmitCreateGroup: expect.any(Function),
      };
      expect(actualHook).toMatchObject(expectedHook);
    });
  });
});


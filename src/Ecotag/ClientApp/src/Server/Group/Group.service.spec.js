import {fetchCreateGroup, fetchGroup, fetchGroups, fetchUpdateGroup, fetchUsers} from "./Group.service";

describe('Group.service', () => {
    describe('.fetchGroups()', () => {
        const givenFetch = jest.fn();
        it('should call fetchGroups', () => {
            fetchGroups(givenFetch)();
            expect(givenFetch).toHaveBeenCalledWith(`groups`);
        });
    });
    describe('.fetchUsers()', () => {
        const givenFetch = jest.fn();
        it('should call fetchUsers', () => {
            fetchUsers(givenFetch)();
            expect(givenFetch).toHaveBeenCalledWith(`users`);
        });
    });
    describe('.fetchGroup()', () => {
        const givenId = "0001";
        const givenFetch = jest.fn();
        it('should call fetchGroup', () => {
            fetchGroup(givenFetch)(givenId);
            expect(givenFetch).toHaveBeenCalledWith(`groups/${givenId}`);
        });
    });
    describe('.fetchCreateGroup()', () => {
        const newGroup = {
            name: "test",
            users: []
        };
        const givenFetch = jest.fn();
        it('should call fetchCreateGroup', () => {
            fetchCreateGroup(givenFetch)(newGroup);
            expect(givenFetch).toHaveBeenCalledWith('groups', {method: 'POST', body: JSON.stringify(newGroup)});
        })
    });
    describe('.fetchUpdateGroup()', () => {
        const updatedGroup = {
            id: "1",
            name: "test",
            users: ["1", "2", "3"]
        };
        const givenFetch = jest.fn();
        it('should call fetchUpdateGroup', () => {
            fetchUpdateGroup(givenFetch)(updatedGroup);
            expect(givenFetch).toHaveBeenCalledWith('groups', {method: 'PUT', body: JSON.stringify(updatedGroup)});
        })
    });
});
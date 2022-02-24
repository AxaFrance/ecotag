import {fetchCreateOrUpdateGroup, fetchGroup, fetchGroups, fetchUsers} from "./Group.service";

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
    describe('.fetchCreateOrUpdateGroup()', () => {
        const newGroup = {
            "name": "test"
        };
        const givenFetch = jest.fn();
        it('should call ', () => {
            fetchCreateOrUpdateGroup(givenFetch)(newGroup);
            expect(givenFetch).toHaveBeenCalledWith(`groups`, { method:'POST', body: JSON.stringify(newGroup) });
        });
    });
});
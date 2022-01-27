import {fetchCreateProject, fetchDatasets, fetchGroups} from "./New.service";

describe('Project/Add/New.service', () => {
    describe('.fetchCreateProject()', () => {
        const givenNewProject = {
            name: "test"
        };
        const givenFetch = jest.fn();
        it('should call fetchCreateProject', () => {
            fetchCreateProject(givenFetch)(givenNewProject);
            expect(givenFetch).toHaveBeenCalledWith(`projects`, { method:'POST', body: JSON.stringify(givenNewProject) });
        });
    });
    describe('.fetchGroups()', () => {
        const givenFetch = jest.fn();
        it('should call fetchGroups', () => {
            fetchGroups(givenFetch)();
            expect(givenFetch).toHaveBeenCalledWith(`groups`);
        });
    });
    describe('.fetchDatasets()', () => {
        const givenFetch = jest.fn();
        it('should call fetchDatasets', () => {
            fetchDatasets(givenFetch)();
            expect(givenFetch).toHaveBeenCalledWith(`datasets`);
        });
    });
});
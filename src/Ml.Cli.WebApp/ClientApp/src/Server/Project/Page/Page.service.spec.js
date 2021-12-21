import {fetchProject,fetchDataset} from "./Page.service";
import {fetchGroup} from "../../Group/Group.service";

describe('Page.service', () => {
    describe('.fetchProject()', () => {
        const givenId = "0001";
        const givenFetch = jest.fn();
        it('should call fetchProject', () => {
            fetchProject(givenFetch)("0001");
            expect(givenFetch).toHaveBeenCalledWith(`projects/${givenId}`);
        });
    });
    describe('.fetchDataset()', () => {
        const givenId = "0001";
        const givenFetch = jest.fn();
        it('should call fetchDataset', () => {
            fetchDataset(givenFetch)("0001");
            expect(givenFetch).toHaveBeenCalledWith(`datasets/${givenId}`);
        });
    });
    describe('.fetchGroup()', () => {
        const givenId = "0001";
        const givenFetch = jest.fn();
        it('should call fetchGroup', () => {
            fetchGroup(givenFetch)(givenId);
            expect(givenFetch).toHaveBeenCalledWith(`groups/${givenId}`, { method: "GET"});
        });
    });
});
import {fetchDeleteProject} from "./Home.service";

describe('Home.service', () => {
    describe('.fetchDeleteProject()', () => {
        const givenId = "0001";
        const givenFetch = jest.fn();
        it('should call fetchDeleteProject', () => {
            fetchDeleteProject(givenFetch)("0001");
            expect(givenFetch).toHaveBeenCalledWith(`projects/${givenId}`, { method:'DELETE' });
        });
    });
});
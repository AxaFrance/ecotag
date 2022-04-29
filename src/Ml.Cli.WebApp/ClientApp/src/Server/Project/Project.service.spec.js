import {fetchProject, fetchCreateProject, fetchDeleteProject} from "./Project.service";

describe('Page.service', () => {
    describe('.fetchProject()', () => {
        const givenId = "0001";
        const givenFetch = jest.fn();
        it('should call fetchProject', () => {
            fetchProject(givenFetch)("0001");
            expect(givenFetch).toHaveBeenCalledWith(`projects/${givenId}`);
        });
    });
    
    describe('.deleteProject', () => {
        const givenId = "0001";
        const givenFetch = jest.fn();
        it('should call deleteProject', () => {
            fetchDeleteProject(givenFetch)(givenId);
            expect(givenFetch).toHaveBeenCalledWith(`projects/delete/${givenId}`, { method: 'POST'});
        });
    });
});

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
});

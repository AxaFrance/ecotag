import { resilienceStatus } from '../../../shared/Resilience';
import fetchDatasets, {Locked} from "../../../Dataset/Dataset.service";
import {fetchGroups} from "../../../Group/Group.service";
import {fetchProjects} from "../../Project.service";

export const init = (fetch, dispatch) => async () => {
  const datasetsPromise = fetchDatasets(fetch)(Locked.Locked);
  const groupsPromise = fetchGroups(fetch)(true);
  const projectsPromise = fetchProjects(fetch)();
  const [datasetsResponse, groupsResponse, projectsResponse] = await Promise.all([datasetsPromise, groupsPromise, projectsPromise]);
    
  let data; 
    if(datasetsResponse.status >= 500 || groupsResponse.status >= 500 || projectsResponse.status >= 500) {
        data = { groups:[], datasets:[], projects:[], status:resilienceStatus.ERROR};
    }
    else {
        const [datasets, groups, projects] = await Promise.all([datasetsResponse.json(), groupsResponse.json(), projectsResponse.json()])
        data = {
            groups,
            datasets,
            projects,
            status: resilienceStatus.SUCCESS};
    }
  dispatch({ type: 'init', data});
};

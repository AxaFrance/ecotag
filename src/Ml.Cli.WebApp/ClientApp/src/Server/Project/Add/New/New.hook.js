import { fetchGroups, fetchDatasets } from './New.service';
import {fetchProjects} from "../../List/Home.service";
import {convertTimestampToDateObject} from "../../../date";
import { resilienceStatus } from '../../../shared/Resilience';

export const init = (fetch, dispatch) => async () => {
  const datasetsPromise = fetchDatasets(fetch)(true);
  const groupsPromise = fetchGroups(fetch)();
  const projectsPromise = fetchProjects(fetch)();
  const [datasetsResponse, groupsResponse, projectsResponse] = await Promise.all([datasetsPromise, groupsPromise, projectsPromise]);
    
  let data; 
    if(datasetsResponse.status >= 500 || groupsResponse.status >= 500 || projectsResponse.status >= 500){
        data = { groups:[], datasets:[], projects:[], status:resilienceStatus.ERROR};
    }
    else {
        const [datasets, groups, projects] = await Promise.all([datasetsResponse.json(), groupsResponse.json(), projectsResponse.json()])
        data = {
            groups,
            datasets,
            projects: convertTimestampToDateObject(projects),
            status: resilienceStatus.SUCCESS};
    }
  dispatch({ type: 'init', data});
};

import React from 'react';
import {Route, Switch, useRouteMatch} from 'react-router-dom';
import New from './Add/New';
import ProjectList from './List';
import ProjectPage from './Page';
import Confirm from './Add/Confirm';
import Annotations from './Annotations';

const Routes = () => {
    const {url} = useRouteMatch();
    return (
        <Switch>
            <Route exact path={`${url}`} component={ProjectList}/>
            <Route path={`${url}/new`} component={New}/>
            <Route path={`${url}/confirm`} component={Confirm}/>
            <Route exact path={`${url}/:id`} component={ProjectPage}/>
            <Route path={`${url}/:projectId/annotations`} component={Annotations}/>
        </Switch>
    );
};

export default Routes;

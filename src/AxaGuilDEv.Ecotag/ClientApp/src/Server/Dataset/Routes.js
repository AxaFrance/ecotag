import React from 'react';
import {Route, Switch, useRouteMatch} from 'react-router-dom';
import Confirm from './Add/Confirm';
import New from './Add/New';
import List from './List';
import Edit from './Edit/index.js';

const Routes = () => {
    const {url} = useRouteMatch();
    return (
        <Switch>
            <Route exact path={`${url}`} component={List}/>
            <Route exact path={`${url}/new`} component={New}/>
            <Route exact path={`${url}/confirm`} component={Confirm}/>
            <Route exact path={`${url}/:id`} component={Edit}/>
        </Switch>
    );
};

export default Routes;

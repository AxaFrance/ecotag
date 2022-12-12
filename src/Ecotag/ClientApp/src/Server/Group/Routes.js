import React from 'react';
import {Route, Switch} from 'react-router-dom';
import PageNotFound from '../NotFound';

const Routes = () => {
    return (
        <Switch>
            <Route component={PageNotFound}/>
        </Switch>
    );
};

export default Routes;

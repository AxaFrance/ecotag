import React from 'react';
import { Switch, Route } from 'react-router-dom';
import Project from './Project';
import Dataset from './Dataset';
import GroupHome from './Group/Home';
import PageNotFound from './NotFound';
import Home from './Home/Home';

const Routes = () => (
    <Switch>
        <Route path="/projects" ><Project/></Route>
        <Route path="/datasets" ><Dataset/></Route>
        <Route path="/teams" ><GroupHome/></Route>
        <Route><Home/></Route>
    </Switch>
  );

export default Routes;

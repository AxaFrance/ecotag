import React from 'react';
import { Switch, Route } from 'react-router-dom';
import Project from './Project';
import Dataset from './Dataset';
import GroupHome from './Group/Home';
import PageNotFound from './NotFound';
import Home from './Home/Home';

const Routes = () => (
    <Switch>
      <Route exact path="/" component={Home} />
      <Route path="/projects" component={Project} />
      <Route path="/datasets" component={Dataset} />
      <Route path="/teams" component={GroupHome} />
      <Route path="/datasets" component={Dataset} />
      <Route component={PageNotFound} />
    </Switch>
  );

export default Routes;

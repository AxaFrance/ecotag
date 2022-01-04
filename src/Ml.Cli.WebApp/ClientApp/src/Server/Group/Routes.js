import React from 'react';
import { Switch, Route } from 'react-router-dom';
import PageNotFound from '../NotFound';

const Routes = () => {
  return (
    <Switch>
      <Route component={PageNotFound} />
    </Switch>
  );
};

export default Routes;

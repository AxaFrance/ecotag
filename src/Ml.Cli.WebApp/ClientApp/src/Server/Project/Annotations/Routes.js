import React from 'react';
import { Switch, Route, useRouteMatch } from 'react-router-dom';
import PageNotFound from '../../NotFound';
import AnnotationDispatchContainer from './AnnotationDispatch.container';

const Routes = () => {
  const { path } = useRouteMatch();
  return (
    <Switch>
      <Route path={`${path}/:documentId`} component={AnnotationDispatchContainer} />
      <Route component={PageNotFound} />
    </Switch>
  );
};

export default Routes;

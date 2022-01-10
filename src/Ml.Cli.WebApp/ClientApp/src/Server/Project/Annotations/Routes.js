import React from 'react';
import { Switch, Route, useRouteMatch } from 'react-router-dom';
import AnnotationDispatchContainer from './AnnotationDispatch.container';

const Routes = () => {
  const { path } = useRouteMatch();
  return (
      
    <Switch>
      <Route path={`${path}/:documentId`} component={AnnotationDispatchContainer} />
    </Switch>
  );
};

export default Routes;

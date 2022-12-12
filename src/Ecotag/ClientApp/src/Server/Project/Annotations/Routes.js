import React from 'react';
import {Route, Switch, useRouteMatch} from 'react-router-dom';
import AnnotationContainer from './Annotation.container';


const Routes = () => {
    const {path} = useRouteMatch();
    return (

        <Switch>
            <Route path={`${path}/:documentId`} component={AnnotationContainer}/>
        </Switch>
    );
};

export default Routes;

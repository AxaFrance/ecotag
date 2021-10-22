import React from "react";
import {Route, Switch, useRouteMatch} from "react-router-dom";
import AnnotationsContainer from "./AnnotationsContainer";
import NotFound from "../PageNotFound/NotFound";

const selectItemById = (annotationState, id) => {
    return annotationState.items.find(x => x.id === id);
};

const Routes = ({annotationState, MonacoEditor, fetchFunction}) => {
    const {url} = useRouteMatch();
    return(
        <Switch>
            <Route path={`${url}/:dataset/:id`} render={(props) => (
                <AnnotationsContainer
                    state={annotationState}
                    currentItem={selectItemById(annotationState, props.match.params.id)}
                    MonacoEditor={MonacoEditor}
                    fetchFunction={fetchFunction}
                />
            )}/>
            <Route exact path={`${url}/annotate-end`}>
                <h3 className="end-message">Thank you, all files from this dataset have been annotated.</h3>
            </Route>
            <Route exact path={url}>
            </Route>
            <Route>
                <NotFound/>
            </Route>
        </Switch>
    );
};

export default Routes;
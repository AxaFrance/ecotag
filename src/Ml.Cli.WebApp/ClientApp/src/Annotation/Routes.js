import React, {useEffect} from "react";
import {Route, Switch, useRouteMatch} from "react-router-dom";
import AnnotationsContainer from "./AnnotationsContainer";

const selectItemById = (annotationState, id) => {
    return annotationState.items.find(x => x.id === id);
};

const Routes = ({annotationState, MonacoEditor, fetchFunction, onStateReinit}) => {
    const {url} = useRouteMatch();
    
    useEffect(() => {
        if(window.location.href.endsWith(url)){
            onStateReinit();
        }
    }, [window.location.href]);
    
    return(
        <Switch>
            <Route exact path={`${url}/:dataset/:id`} render={(props) => (
                <AnnotationsContainer
                    state={annotationState}
                    entryItem={selectItemById(annotationState, props.match.params.id)}
                    MonacoEditor={MonacoEditor}
                    fetchFunction={fetchFunction}
                />
            )}/>
        </Switch>
    );
};

export default Routes;
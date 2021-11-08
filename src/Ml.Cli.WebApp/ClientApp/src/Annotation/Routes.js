import React, {useEffect} from "react";
import {Route, Switch, useRouteMatch, withRouter} from "react-router-dom";
import AnnotationsContainer from "./AnnotationsContainer";



const Annotation = props => {
    const {
        match: {
            params: {id, dataset},
        },
        annotationState,
        MonacoEditor,
        fetchFunction,
        url
    } = props;
    useEffect(() => {
        console.log("youhou")
    }, []);
    return <AnnotationsContainer
        state={annotationState}
        id={id}
        url={url}
        dataset={dataset}
        MonacoEditor={MonacoEditor}
        fetchFunction={fetchFunction}
    />
}

const AnnotationWithRouter= React.memo(withRouter(Annotation));

const Routes = ({annotationState, MonacoEditor, fetchFunction, onStateReinit}) => {
    const {url} = useRouteMatch();
    
    /*useEffect(() => {
        console.log("Routes") 
        if(window.location.href.endsWith(url)){
            onStateReinit();
        }
    }, [window.location.href]);
    */
    return(
        <Switch>
            <Route exact path={`${url}/:dataset/:id`} >
                <AnnotationWithRouter annotationState={annotationState} url={url} MonacoEditor={MonacoEditor} fetchFunction={fetchFunction}  />
            </Route>
        </Switch>
    );
};

export default React.memo(Routes);
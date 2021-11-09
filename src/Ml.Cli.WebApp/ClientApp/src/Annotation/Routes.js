import React, {useEffect} from "react";
import {Route, Switch, useRouteMatch, withRouter} from "react-router-dom";
import AnnotationsContainer from "./AnnotationsContainer";


const Annotation = props => {
    const {
        match: {
            params: {id, dataset},
        },
        annotationState,
        fetchFunction,
        url
    } = props;
    return <AnnotationsContainer
        state={annotationState}
        id={id}
        url={url}
        dataset={dataset}
        fetchFunction={fetchFunction}
    />
}

const AnnotationWithRouter= React.memo(withRouter(Annotation));

const Routes = ({annotationState, fetchFunction}) => {
    const {url} = useRouteMatch();
    
    return(
        <Switch>
            <Route exact path={`${url}/:dataset/:id`} >
                <AnnotationWithRouter annotationState={annotationState} url={url} fetchFunction={fetchFunction}  />
            </Route>
        </Switch>
    );
};

export default React.memo(Routes);
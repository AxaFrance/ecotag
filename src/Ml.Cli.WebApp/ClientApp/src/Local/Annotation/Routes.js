import React from "react";
import {Route, Switch, useRouteMatch, withRouter} from "react-router";
import AnnotationsContainer from "./AnnotationsContainer";
import TitleBar from "../../TitleBar";
import DatasetHandler from "./DatasetHandler";

const Annotation = props => {
    const {
        match: {
            params: {id, dataset},
        },
        annotationState,
        fetchFunction,
        url
    } = props;
    return (
    <>
        <TitleBar
            title={dataset}
            goTo="/annotate"
            goTitle="Annotate"
        />
        <AnnotationsContainer
            state={annotationState}
            id={id}
            url={url}
            dataset={dataset}
            fetchFunction={fetchFunction}
        />
    </>);
}

const Annotate = ({fetchFunction, state, setState}) => {
    return (
        <>
            <TitleBar title={`Annotate`} />
            <DatasetHandler state={state} setState={setState} fetchFunction={fetchFunction}/>
        </>
    );
}

const AnnotationWithRouter= React.memo(withRouter(Annotation));

const Routes = ({state, setState, fetchFunction}) => {
    const {url} = useRouteMatch();
    
    return(
        <Switch>
            <Route exact path={`${url}/:dataset/:id`} >
                <AnnotationWithRouter annotationState={state} url={url} fetchFunction={fetchFunction}  />
            </Route>
            <Route>
                <Annotate state={state} setState={setState}  fetchFunction={fetchFunction}/>
            </Route>
        </Switch>
    );
};

export default React.memo(Routes);
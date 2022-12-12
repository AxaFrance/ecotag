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
        fetch,
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
                fetch={fetch}
            />
        </>);
}

const Annotate = ({fetch, state, setState}) => {
    return (
        <>
            <TitleBar title={`Annotate`}/>
            <DatasetHandler state={state} setState={setState} fetch={fetch}/>
        </>
    );
}

const AnnotationWithRouter = React.memo(withRouter(Annotation));

const Routes = ({state, setState, fetch}) => {
    const {url} = useRouteMatch();

    return (
        <Switch>
            <Route exact path={`${url}/:dataset/:id`}>
                <AnnotationWithRouter annotationState={state} url={url} fetch={fetch}/>
            </Route>
            <Route>
                <Annotate state={state} setState={setState} fetch={fetch}/>
            </Route>
        </Switch>
    );
};

export default React.memo(Routes);
import {Switch, Route} from 'react-router';
import Home from "./Home";
import Compare from "./Comparison/Compare";
import Annotate from "./Annotation/Annotate";
import React from "react";
import NotFound from "./PageNotFound/NotFound";

const Routes = () => {
    const MonacoEditor = React.lazy(() => import("@monaco-editor/react"));

    return (
        <Switch>
            <Route exact path="/">
                <Home/>
            </Route>
            <Route exact path="/compare">
                <Compare
                    MonacoEditor={MonacoEditor}
                    fetchFunction={fetch}
                />
            </Route>
            <Route exact path="/annotate">
                <Annotate
                    MonacoEditor={MonacoEditor}
                    fetchFunction={fetch}
                />
            </Route>
            <Route>
                <NotFound/>
            </Route>
        </Switch>
    );
};

export default Routes;

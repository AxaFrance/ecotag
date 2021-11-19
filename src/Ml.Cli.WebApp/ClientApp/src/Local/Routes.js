import {Switch, Route} from 'react-router';
import Home from "./Home";
import Compare from "./Comparison/Compare";
import Annotate from "./Annotation/Annotate";
import React from "react";
import NotFound from "./PageNotFound/NotFound";
import withCustomFetch from "./withCustomFetch";
import ImageGallery from "./Gallery/ImageGallery";

const MonacoEditor = React.lazy(() => import("@monaco-editor/react"));

export const Routes = ({fetch}) => {

    return (
        <Switch>
            <Route exact path="/">
                <Home/>
            </Route>
            <Route path="/compare">
                <Compare
                    MonacoEditor={MonacoEditor}
                    fetchFunction={fetch}
                />
            </Route>
            <Route path="/annotate">
                <Annotate
                    MonacoEditor={MonacoEditor}
                    fetchFunction={fetch}
                />
            </Route>
            <Route path="/gallery">
                <ImageGallery
                    fetchFunction={fetch}
                />
            </Route>
            <Route>
                <NotFound/>
            </Route>
        </Switch>
    );
};

export default withCustomFetch(fetch)(Routes);

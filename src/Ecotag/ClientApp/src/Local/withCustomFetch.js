import React from 'react';
import {withEnvironment} from "./EnvironmentProvider";

const customFetch = fetch => apiBaseUrl => async (path, config) => {
    if (path.startsWith("/")) {
        path = path.replace("/", "")
    }
    const url = apiBaseUrl.replace('{path}', path);
    return fetch(url, config);
};

const withCustomFetch = fetch => Component => ({environment, ...otherProps}) => {
    const fechToUse = otherProps.fetch ? otherProps.fetch : fetch;
    return <Component {...otherProps} fetch={customFetch(fechToUse)(environment.apiUrl)}/>;
};

export default (fetch = undefined) => Component => withEnvironment(withCustomFetch(fetch)(Component))

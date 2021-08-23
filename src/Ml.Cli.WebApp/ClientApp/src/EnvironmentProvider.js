import React, { createContext, useEffect, useState } from 'react';
import { Loader } from '@axa-fr/react-toolkit-all';

export const EnvironmentContext = createContext("environment");

export const EnvironmentConsumer = EnvironmentContext.Consumer;

export const withEnvironment = Component => props => (
    <EnvironmentConsumer>
        {store => <Component {...props} {...store} />}
    </EnvironmentConsumer>
);

const addEndSlash = (url) => url.endsWith('/') ? url : url + "/";

const EnvironmentProvider = ({ children }) => {
    const [environment, setEnvironment] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const environment = {
            "apiUrl": addEndSlash(window.location.href) + "{path}",
            "basePath" : window.location.pathname + "ml-cli"
        };
        setEnvironment({ environment });
        setLoading(false);
    }, []);

    return (
        <>
            {loading ? (
                <Loader mode="get" text="Loading..." />
            ) : (
                <EnvironmentContext.Provider value={environment}>
                    {children}
                </EnvironmentContext.Provider>
            )}
        </>
    );
};

export default EnvironmentProvider;

import React, {createContext, useState} from 'react';
import {ApplicationInsights} from '@microsoft/applicationinsights-web';
import {v4 as uuidv4} from 'uuid';

export const telemetryEvents = Object.freeze({
    CREATE_PROJECT: Symbol("CREATE_PROJECT"),
    CREATE_DATASET: Symbol("CREATE_DATASET"),
    CREATE_GROUP: Symbol("CREATE_GROUP"),
});

const initAppInsights = (instrumentationKey) => {
    const acceptAllLogs = () => true;
    const appInsights = new ApplicationInsights({
        config: {
            instrumentationKey,
            loggingLevelConsole: 2,
            loggingLevelTelemetry: 2,
            autoTrackPageVisitTime: true,
            enableAutoRouteTracking: true,
            disableFetchTracking: false,
            isRetryDisabled: true,
            enableCorsCorrelation: false,
            enableRequestHeaderTracking: true,
            enableAjaxPerfTracking: true,
            enableUnhandledPromiseRejectionTracking: true,
        },
    });

    appInsights.loadAppInsights();
    appInsights.trackPageView();
    appInsights.addTelemetryInitializer(acceptAllLogs);
    return appInsights;
};

export const buildLog = (
    pathname,
    {
        date,
        correlationId,
        featureId,
        featureName,
        logLevel,
        appName,
        hostname,
        machineName
    }
) => `${date};${hostname};${machineName};;${logLevel};${appName};;${correlationId};${featureId};${featureName};${pathname}`;

export const buildAppInsightsEvent = props => log => ({
    name: log && log.description ? log.description : log,
    properties: props
});

export const withTelemetry = Component => props => (
    <TelemetryConsumer>
        {store => <Component {...props} {...store} />}
    </TelemetryConsumer>
);

export const TelemetryContext = createContext("telemetry");

export const TelemetryConsumer = TelemetryContext.Consumer;

const correlationId = uuidv4();

const TelemetryProvider = ({
                               children, active,
                               logLevel,
                               instrumentationKey
                           }) => {

    const locationPathname = window.location.pathname;
    const [appInsightsLogger, setAppInsightsLogger] = useState(null);

    const featureId = uuidv4();
    const featureName = "ECOTAG:FRONT";
    const logProps = {
        featureId,
        featureName,
        appName: 'ECOTAG',
        correlationId,
        logLevel: logLevel || '',
        date: new Date().toISOString(),
        hostname: window.location.href,
        machineName: window.navigator.userAgent,
    };

    React.useEffect(() => {
        if (active === true) {
            const appInsights = initAppInsights(instrumentationKey);
            setAppInsightsLogger(appInsights);
            appInsights.trackPageView({name: location.pathname});
            appInsights.trackTrace({
                message: buildLog(location.pathname, logProps),
            });
        }
    }, [locationPathname]);

    const telemetry = {
        trackEvent: (eventName) => {
            if (active === true) {
                appInsightsLogger.trackEvent(buildAppInsightsEvent(logProps)(eventName));
            }
        }
    }

    return (
        <>
            <TelemetryContext.Provider value={{telemetry}}>
                {children}
            </TelemetryContext.Provider>
        </>
    );
};

export default TelemetryProvider;

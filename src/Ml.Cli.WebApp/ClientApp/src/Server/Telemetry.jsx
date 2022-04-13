import React, { createContext, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { ApplicationInsights } from '@microsoft/applicationinsights-web';
import { v4 as uuidv4 } from 'uuid';

export const telemetryEvents = Object.freeze({
    CREATE_PROJECT: Symbol("CREATE_PROJECT"),
    CREATE_DATASET: Symbol("CREATE_DATASET"),
    CREATE_GROUP: Symbol("CREATE_GROUP"),
});

class TelemetryStore {
    constructor(instrumentationKey){
        if(!TelemetryStore.instance){
            const acceptAllLogs = () => true;
            TelemetryStore.instance = this;
            this.appInsights = new ApplicationInsights({
                config: {
                    instrumentationKey,
                    loggingLevelConsole: 2,
                    loggingLevelTelemetry: 2,
                    autoTrackPageVisitTime: true,
                    enableAutoRouteTracking: true,
                    disableFetchTracking: false,
                    isRetryDisabled: true,
                    enableCorsCorrelation: true,
                    enableRequestHeaderTracking: true,
                    enableAjaxPerfTracking: true,
                    enableUnhandledPromiseRejectionTracking: true,
                },
            });

            this.appInsights.loadAppInsights();
            this.appInsights.trackPageView();
            this.appInsights.addTelemetryInitializer(acceptAllLogs);
        }

        return TelemetryStore.instance;
    }
}

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

const TelemetryProvider = ({ children,  active,
                               logLevel,
                               instrumentationKey }) => {

    const location = useLocation();
    const [appInsightsLogger, setAppInsightsLogger] = useState(null);

    const featureId = uuidv4();
    const featureName = "ECOTAG:FRONT";
    const logProps = {
        featureId,
        featureName,
        appName: 'ECOTAG',
        correlationId: uuidv4(),
        logLevel: logLevel || '',
        date: new Date().toISOString(),
        hostname: window.location.href,
        machineName: window.navigator.userAgent,
    };
    const instance = new TelemetryStore(instrumentationKey);
    Object.freeze(instance);
    React.useEffect(() => {
        if (active === true) {
            setAppInsightsLogger(instance.appInsights);
            instance.appInsights.trackPageView({name: location.pathname});
            instance.appInsights.trackTrace({
                message: buildLog(location.pathname, logProps),
            });
        }
    }, [location.pathname]);
    
    const telemetry ={
        trackEvent: (eventName) => appInsightsLogger.trackEvent(buildAppInsightsEvent(logProps)(eventName))
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

import React, { createContext, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { ApplicationInsights } from '@microsoft/applicationinsights-web';
import { v4 as uuidv4 } from 'uuid';

export const events = Object.freeze({
    DOWNLOAD_CERTIFICATE: Symbol("DOWNLOAD_CERTIFICATE"),
    SAVE_QUOTE: Symbol("SAVE_QUOTE"),
    SAVE_QUOTE_ERROR: Symbol("SAVE_QUOTE_ERROR"),
    SUBSCRIBE_QUOTE_ERROR: Symbol("SUBSCRIBE_QUOTE_ERROR"),
    QUOTE_ERROR: Symbol("QUOTE_ERROR"),
    QUOTE_SUCCESS: Symbol("QUOTE_SUCCESS"),
    QUOTE_ERROR_500: Symbol("QUOTE_ERROR_500"),
    ORDER_SUCCESS_BY_SAVED_QUOTE: Symbol("ORDER_SUCCESS_BY_SAVED_QUOTE"),
    ORDER_SUCCESS_BY_DIRECT_QUOTE: Symbol("ORDER_SUCCESS_BY_DIRECT_QUOTE"),
    RATTACHMENT_DONE: Symbol("RATTACHMENT_DONE"),
    MAIL_SENT: Symbol("MAIL_SENT"),
});

class AppInsightsStore {
    constructor(instrumentationKey){
        if(!AppInsightsStore.instance){
            const acceptAllLogs = () => true;
            AppInsightsStore.instance = this;
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

        return AppInsightsStore.instance;
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

export const withAppInsightsProvider = Component => props => (
    <AppInsightsConsumer>
        {store => <Component {...props} {...store} />}
    </AppInsightsConsumer>
);

export const AppInsightsContext = createContext("appInsights");

export const AppInsightsConsumer = AppInsightsContext.Consumer;

const AppInsightsProvider = ({ children, appInsights }) => {
    const {
        active,
        logLevel,
        instrumentationKey
    } = appInsights;
    const location = useLocation();
    const [appInsightsLogger, setAppInsightsLogger] = useState(null);

    const featureId = uuidv4();
    const featureName = "ADVALOREM:FRONT";
    const logProps = {
        featureId,
        featureName,
        appName: 'ADVALOREM',
        correlationId: uuidv4(),
        logLevel: logLevel || '',
        date: new Date().toISOString(),
        hostname: window.location.href,
        machineName: window.navigator.userAgent,
    };
    const instance = new AppInsightsStore(instrumentationKey);
    Object.freeze(instance);
    React.useEffect(() => {
        if (active === true) {
            setAppInsightsLogger(instance.appInsights);
            instance.appInsights.trackPageView({name: location.pathname});
            instance.appInsights.trackTrace({
                message: buildLog(location.pathname, logProps),
            });
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [location.pathname]);

    return (
        <>
            <AppInsightsContext.Provider value={{logger: appInsightsLogger, buildEvent: buildAppInsightsEvent(logProps), events}}>
                {children}
            </AppInsightsContext.Provider>
        </>
    );
};

export default AppInsightsProvider;

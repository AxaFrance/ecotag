import React from 'react';
import {BrowserRouter as Router} from 'react-router-dom';
import {render} from '@testing-library/react';
import TelemetryProvider, {buildAppInsightsEvent, buildLog, telemetryEvents} from './Telemetry';

const {v4: uuidv4} = require('uuid');

describe('Telemetry', () => {
    describe('.buildAppInsightsEvent()', () => {
        const givenProps = {
            date: new Date().toISOString(),
            correlationId: uuidv4(),
            featureId: uuidv4(),
            featureName: "ECOTAG:FRONT",
            logLevel: "debug",
            appName: 'ECOTAG',
            hostname: window.location.href,
            machineName: window.navigator.userAgent,
        };
        test('should build an app insight event', () => {
            // given
            // when
            const actualEvent = buildAppInsightsEvent(givenProps)(telemetryEvents.CREATE_PROJECT);
            // then
            expect(actualEvent).toMatchObject({
                name: "CREATE_PROJECT",
                properties: givenProps
            });
        });
        test('should build an app insight event without a known event', () => {
            // given
            // when
            const actualEvent = buildAppInsightsEvent(givenProps)("otherEvent");
            // then
            expect(actualEvent).toMatchObject({
                name: "otherEvent",
                properties: givenProps
            });
        });
    });

    describe('.buildLog()', () => {
        it('should build a valid log in CSV with AXA format', () => {
            // given
            const givenLog = {
                date: new Date().toISOString(),
                correlationId: 'uuidv4',
                featureName: 'myFeature',
                featureId: 'featureId',
                logLevel: 'DEBUG',
                appName: 'ECOTAG',
                hostname: window.location.href,
                machineName: window.navigator.userAgent,
            };
            // when
            const actualRisk = buildLog('/devis', givenLog);
            // then
            const expectedLog = `${givenLog.date};${givenLog.hostname};${givenLog.machineName};;${givenLog.logLevel};${givenLog.appName};;${givenLog.correlationId};${givenLog.featureId};${givenLog.featureName};/devis`;
            expect(actualRisk).toBe(expectedLog);
        });
    });

    describe('.AppInsightsProvider()', () => {
        it('should render AppInsightsProvider', async () => {
            // given
            const givenAppInsights = {
                "active": true,
                "instrumentationKey": "d2407d3d-d703-4005-b355-89bfa863a88c",
                "logLevel": "debug"
            };
            const givenChildren = <div></div>;

            // when
            const {container} = render(
                <Router>
                    <TelemetryProvider {...givenAppInsights} children={givenChildren}/>
                </Router>
            );

            // then
            expect(container).toMatchSnapshot();
        });
    });
});

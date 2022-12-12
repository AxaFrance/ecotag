import React from 'react';
import {resilienceStatus, withResilience} from '.';

export default {title: 'Resilience'};

const BasicComponent = () => <><p>Ceci est un composant basic de succès</p></>;

const ComponentWithResilience = withResilience(BasicComponent);

export const withError = () => <ComponentWithResilience status={resilienceStatus.ERROR}/>;

export const withForbidden = () => <ComponentWithResilience status={resilienceStatus.FORBIDDEN}/>;

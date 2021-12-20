import React from 'react';
import { storiesOf } from '@storybook/react';
import EditContainer from "./EditContainer";
import { Router } from 'react-router-dom';
import { createMemoryHistory } from 'history';

const history = createMemoryHistory();
storiesOf('Edition dataset', module).add('Edit dataset', () => (
    <Router history={history}><EditContainer /></Router>
));

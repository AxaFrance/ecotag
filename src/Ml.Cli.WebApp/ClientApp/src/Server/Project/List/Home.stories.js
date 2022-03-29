import React from 'react';
import { action } from '@storybook/addon-actions';
import Home from './Home';
import { initialState } from './Home.reducer';
import { LoaderModes } from "@axa-fr/react-toolkit-loader";
import { BrowserRouter as Router } from 'react-router-dom';
import { HomeContainer } from './Home.container';
import { fetch } from './Home.container.spec';

export default { title: 'Project/Home' };

export const withDefault = () => <Router><HomeContainer fetch={fetch} /></Router>;

export const withLoader = () => <Router><Home loaderMode={LoaderModes.get} items={[]} onChangeSort={action('onChangeSort')} onClick={action('onClick')} filters={initialState.filters} /></Router>;


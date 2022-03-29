import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { HomeContainer } from './Home.container';
import {fetch} from './mock';
export default { title: 'Project/Home' };


export const withDefault = () => <Router><HomeContainer fetch={fetch} /></Router>;

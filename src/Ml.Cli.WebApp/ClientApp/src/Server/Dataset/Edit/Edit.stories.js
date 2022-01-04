import React from 'react';
import EditContainer from "./EditContainer";
import { Router } from 'react-router-dom';
import { createMemoryHistory } from 'history';

const history = createMemoryHistory();

export default {
    title: 'Edition dataset',
    component: EditContainer
};

const Template = () => <Router history={history}><EditContainer /></Router>;
export const EditDataset = Template.bind({});

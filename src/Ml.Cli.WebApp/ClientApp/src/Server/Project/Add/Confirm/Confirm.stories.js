import React from 'react';
import { action } from '@storybook/addon-actions';
import { Confirm } from './Confirm';
import { BrowserRouter as Router } from 'react-router-dom';

export default { title: 'Project/Add/Confirm' };

export const withDefault = () => <Router><Confirm onClick={action('onClick')} /></Router>;

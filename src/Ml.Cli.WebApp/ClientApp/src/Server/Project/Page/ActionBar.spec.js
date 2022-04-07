import '@testing-library/jest-dom/extend-expect';
import React from 'react';
import { render, waitFor } from '@testing-library/react';
import {ActionBar} from './ActionBar';
import {BrowserRouter as Router} from "react-router-dom";
import {DataScientist} from "../../withAuthentication";

describe('ActionBar', () => {
    it('ActionBar render correctly', async () => {
        const { asFragment, getByText } = render(<Router><ActionBar user={{roles: [DataScientist]}} projectId={"0001"} projectName={"projectName"} isAnnotationClosed={false}/></Router>);
        const messageEl = await waitFor(() => getByText('Start Tagging'));
        expect(messageEl).toHaveTextContent(
            'Start Tagging'
        );
        expect(asFragment()).toMatchSnapshot();
    });
});


import '@testing-library/jest-dom/extend-expect';
import React from 'react';
import { render, waitFor } from '@testing-library/react';
import {ActionBar} from './ActionBar';
import {BrowserRouter as Router} from "react-router-dom";

jest.mock('react-router-dom', () => {
    // Require the original module to not be mocked...
    const originalModule = jest.requireActual('react-router-dom');

    return {
        __esModule: true,
        ...originalModule,
        // add your noops here
        useParams: jest.fn(),
        useHistory: jest.fn(),
    };
});

describe('ActionBar', () => {
    it('ActionBar render correctly', async () => {
        const project = {
            "id": "0001",
            "name": "Relevé d'information",
            "datasetId": "0004",
            "numberTagToDo": 10,
            "createDate": new Date("04-04-2011").getTime(),
            "annotationType": "NER",
            annotationStatus : {isAnnotationClosed : false}
        };

        const { asFragment, getByText } = render(<Router><ActionBar project={project}/></Router>);
        const messageEl = await waitFor(() => getByText('Start Tagging'));
        expect(messageEl).toHaveTextContent(
            'Start Tagging'
        );
        expect(asFragment()).toMatchSnapshot();
    });
});


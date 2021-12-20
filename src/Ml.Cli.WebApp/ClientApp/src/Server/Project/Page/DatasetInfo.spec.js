import '@testing-library/jest-dom/extend-expect';
import React from 'react';
import { render, waitForElement } from '@testing-library/react';
import {DatasetInfo} from './DatasetInfo';
import {BrowserRouter as Router} from "react-router-dom";

describe('DatasetInfo', () => {
    it('DatasetInfo render correctly', async () => {
        const dataset = {
            "id": "0001",
            "name": "Carte verte",
            "type": "Image",
            "classification": "Publique",
            "numberFiles": 300,
            "createDate": "30/10/2019"
        };
        const { asFragment, getByText } = render(<Router><DatasetInfo dataset={dataset} /></Router>);
        const messageEl = await waitForElement(() => getByText('Dataset'));
        expect(messageEl).toHaveTextContent(
            'Dataset'
        );
        expect(asFragment()).toMatchSnapshot();
    });
});


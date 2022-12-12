import '@testing-library/jest-dom/extend-expect';
import React from 'react';
import {render, waitFor} from '@testing-library/react';
import {Label} from './LabelsList';
import {BrowserRouter as Router} from "react-router-dom";

describe('Label', () => {
    it('Label render correctly', async () => {
        const labels = [
            {
                id: 'id',
                name: 'label',
                color: 'red'
            }
        ];
        const {asFragment, getByText} = render(<Router><Label labels={labels}/></Router>);
        const messageEl = await waitFor(() => getByText('Labels'));
        expect(messageEl).toHaveTextContent(
            'Labels'
        );
        expect(asFragment()).toMatchSnapshot();
    });
});


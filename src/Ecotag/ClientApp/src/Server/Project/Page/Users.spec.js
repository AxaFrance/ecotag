import '@testing-library/jest-dom/extend-expect';
import React from 'react';
import {render, waitFor} from '@testing-library/react';
import {UserAnnotationsStatus} from './Users';
import {BrowserRouter as Router} from "react-router-dom";

const users = [
    {
        id: "0001",
        "email": "guillaume.chervet@axa.fr",
        "nameIdentifier": "S000007"
    },
    {
        id: "0002",
        "email": "lilian.delouvy@axa.fr",
        "nameIdentifier": "S000005"
    }
]

const numberAnnotationsByUsers = [{"nameIdentifier": "S000005", numberAnnotations: 15}, {
    "nameIdentifier": "S000007",
    numberAnnotations: 35
}]

describe('Users', () => {
    it('Users render correctly', async () => {
        const {asFragment, getByText} = render(<Router><UserAnnotationsStatus users={users}
                                                                              numberAnnotationsByUsers={numberAnnotationsByUsers}/></Router>);
        await waitFor(() => expect(getByText(/Emails/i)).not.toBeNull());
        expect(asFragment()).toMatchSnapshot();
    });
});


import '@testing-library/jest-dom/extend-expect';
import React from 'react';
import { render, waitFor } from '@testing-library/react';
import {UserAnnotationsStatus} from './Users';
import {BrowserRouter as Router} from "react-router-dom";

describe('Users', () => {
  it('Users render correctly', async () => {
    const { asFragment, getByText } = render(<Router><UserAnnotationsStatus users={[{email:'titi', annotationCounter: 10}, {email:'toto', annotationCounter: 0}]} /></Router>);
    await waitFor(() => expect(getByText(/Emails/i)).not.toBeNull());
    expect(asFragment()).toMatchSnapshot();
  });
});


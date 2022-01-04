import '@testing-library/jest-dom/extend-expect';
import React from 'react';
import { render, waitFor } from '@testing-library/react';
import {User} from './Users';
import {BrowserRouter as Router} from "react-router-dom";

describe('Users', () => {
  it('Users render correctly', async () => {
    const { asFragment, getByText } = render(<Router><User users={[{'email':'titi'}, {'email':'toto'}]} /></Router>);
    const messageEl = await waitFor(() => getByText('Informations annotateurs'));
    expect(messageEl).toHaveTextContent(
        'Informations annotateurs'
    );
    expect(asFragment()).toMatchSnapshot();
  });
});


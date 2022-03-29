import '@testing-library/jest-dom/extend-expect';
import React from 'react';
import { render, waitFor } from '@testing-library/react';
import { HomeContainer } from './Home.container';
import {BrowserRouter as Router} from "react-router-dom";

import {fetch} from './mock';


describe('Home.container', () => {
  it('HomeContainer render correctly', async () => {
    const { asFragment, getByText } = render(<Router><HomeContainer fetch={fetch} /></Router>);
    const messageEl = await waitFor(() => getByText('31/03/0001'));
    expect(messageEl).toHaveTextContent(
      '31/03/0001'
    );
    expect(asFragment()).toMatchSnapshot();
  });
});


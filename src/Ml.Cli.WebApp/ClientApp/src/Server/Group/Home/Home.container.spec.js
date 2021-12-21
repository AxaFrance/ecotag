
import '@testing-library/jest-dom/extend-expect';
import React from 'react';
import { createMemoryHistory } from "history";
import { Router } from 'react-router-dom';
import { render, waitForElement } from '@testing-library/react';
import { HomeContainer } from './Home.container';

describe('Home.container for groups', () => {

  const history = createMemoryHistory({ initialEntries: ['/'] });
  const givenGroups = [{
    "id": "0001",
    "name": "developpeurs",
    "users": [
      { "email": "clement.trofleau.lbc@axa.fr" },
      { "email": "gilles.cruchon@axa.fr" },
      { "email": "francois.descamps@axa.fr" },
      { "email": "guillaume.chervet@axa.fr" }
    ]
  }];
  const givenFetch = jest.fn(() => Promise.resolve(givenGroups));
  
  it('HomeContainer render correctly the groups', async () => {
    const { getByText } = render(<Router history={history}><HomeContainer fetch={givenFetch} /></Router>);
    const messageEl = await waitForElement(() => getByText('developpeurs'));
    expect(messageEl).toHaveTextContent(
      'developpeurs'
    );
  });
});

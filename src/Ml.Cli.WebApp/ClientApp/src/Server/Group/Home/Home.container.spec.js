import React from 'react';
import { createMemoryHistory } from "history";
import { BrowserRouter } from 'react-router-dom';
import { render, waitFor } from '@testing-library/react';
import { HomeContainer } from './Home.container';
import sleep from "../../../sleep";

describe('Home.container for groups', () => {

  const history = createMemoryHistory({ initialEntries: ['/'] });
  const givenGroups = [{
    id: "0001",
    name: "developpeurs",
    userIds: ["0001","0002"]
  }];
  const givenFetch = async (url) => {
    await sleep(1);
    switch (url) {
      case "groups":
        return {ok: true, json: () => Promise.resolve(givenGroups)};
      default:
        return {ok: true, json: () => Promise.resolve([{id: "0001", email: "gilles.cruchon@axa.fr"}, {id: "0002", email: "guillaume.chervet@axa.fr"}])};
    }
  };
  
  it('HomeContainer render correctly the groups', async () => {
    const { asFragment, getByText } = render(<BrowserRouter history={history}><HomeContainer fetch={givenFetch} /></BrowserRouter>);
    const messageEl = await waitFor(() => getByText('developpeurs'));
    expect(messageEl).toHaveTextContent(
        'developpeurs'
    );
    expect(asFragment()).toMatchSnapshot();
  });
});


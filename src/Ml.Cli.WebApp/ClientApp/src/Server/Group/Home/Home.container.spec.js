
import '@testing-library/jest-dom/extend-expect';
import React from 'react';
import { createMemoryHistory } from "history";
import { BrowserRouter } from 'react-router-dom';
import { render, waitFor } from '@testing-library/react';
import { HomeContainer } from './Home.container';
import sleep from "../../../sleep";
import {isPromise} from "env-cmd/dist/utils";

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
  const givenFetch = async (url, config) => {
    await sleep(1);
    switch (url) {
      case "groups":
        return  Promise.resolve(givenGroups);
      default:
        return  Promise.resolve(["gilles.cruchon@axa.fr", "guillaume.chervet@axa.fr"]);
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


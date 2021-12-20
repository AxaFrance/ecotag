
import '@testing-library/jest-dom/extend-expect';
import React from 'react';
import { render, waitForElement, getByText } from '@testing-library/react';
import { HomeContainer } from './Home.container';
import {BrowserRouter as Router} from "react-router-dom";

const fetch = () => Promise.resolve([{
  "id": "0001",
  "name": "Carte verte",
  "type": "Image",
  "classification": "Publique",
  "numberFiles": 300,
  "createDate": "30/10/2019"
}]);

describe('Home.container', () => {

  it('HomeContainer render correctly', async () => {
    const { asFragment, getByText } = render(<Router><HomeContainer fetch={fetch} /></Router>);
    const messageEl = await waitForElement(() => getByText('Carte verte'));
    expect(messageEl).toHaveTextContent(
      'Carte verte'
    );
    expect(asFragment()).toMatchSnapshot();
  });

});


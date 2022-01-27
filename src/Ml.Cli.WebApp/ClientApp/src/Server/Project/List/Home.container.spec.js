
import '@testing-library/jest-dom/extend-expect';
import React from 'react';
import { render, waitFor } from '@testing-library/react';
import { HomeContainer } from './Home.container';
import {BrowserRouter as Router} from "react-router-dom";

const fetch = () => Promise.resolve({ok: true, json: () => Promise.resolve([{
    "id": "0001",
    "name": "Relevé d'information",
    "classification": "Publique",
    "numberTagToDo": 10,
    "createDate": "04/04/2011",
    "typeAnnotation": "NER",
    "text": "Enim ad ex voluptate culpa non cillum eu mollit nulla ex pariatur duis. Commodo officia deserunt elit sint officia consequat elit laboris tempor qui est ex. Laborum magna id deserunt ut fugiat aute nulla in Lorem pariatur. Nostrud elit consectetur exercitation exercitation incididunt consequat occaecat velit voluptate nostrud sunt. Consectetur velit eu amet minim quis sunt in.",
  }])});

describe('Home.container', () => {
  it('HomeContainer render correctly', async () => {
    const { asFragment, getByText } = render(<Router><HomeContainer fetch={fetch} /></Router>);
    const messageEl = await waitFor(() => getByText('Publique'));
    expect(messageEl).toHaveTextContent(
      'Publique'
    );
    expect(asFragment()).toMatchSnapshot();
  });
});


import React from 'react';
import { initialState } from './Home.reducer';
import { MemoryRouter } from 'react-router-dom';
import Home from './Home';

const listOfGroups = [
  {
    "id": "0001",
    "name": "developpeurs",
    "users": [
      { "email": "clement.trofleau.lbc@axa.fr" },
      { "email": "gilles.cruchon@axa.fr" },
      { "email": "francois.descamps@axa.fr" },
      { "email": "guillaume.chervet@axa.fr" }
    ]
  },
  {
    "id": "0002",
    "name": "tls",
    "users": [
      { "email": "francois.descamps@axa.fr" },
      { "email": "guillaume.chervet@axa.fr" }
    ]
  },
  {
    "id": "0003",
    "name": "managers",
    "users": [
      { "email": "gilles.cruchon@axa.fr" }
    ]
  }
];
const history = () => {};

export default {
  title: 'Groups/Home',
  component: Home
};

const Template = (args) => <MemoryRouter><Home{...args}/></MemoryRouter>;

export const ListOfGroups = Template.bind({});
ListOfGroups.args = {
  history: history,
  items: listOfGroups,
  numberItemsTotal: 10,
  filters: initialState.filters,
  fields: initialState.fields,
  hasSubmit: false,
  onChangePaging: () => {},
  onChangeFilter: () => {},
  onChangeCreateGroup: () => {},
  onSubmitCreateGroup: () => {}
}

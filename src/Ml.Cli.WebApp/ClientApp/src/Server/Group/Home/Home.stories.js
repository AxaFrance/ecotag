import React from 'react';
import { storiesOf } from '@storybook/react';
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

storiesOf('Groups/Home', module).add('List of groups', () => (
  <MemoryRouter>
    <Home 
      history={history} 
      items={listOfGroups} 
      numberItemsTotal={10} 
      filters={initialState.filters}
      fields={initialState.fields}
      hasSubmit={false} 
      onChangePaging={()=>{}} 
      onChangeFilter={()=>{}} 
      onDeleteGroup={()=>{}}
      onChangeCreateGroup={()=>{}} 
      onSubmitCreateGroup={()=>{}}
    />
  </MemoryRouter>
));

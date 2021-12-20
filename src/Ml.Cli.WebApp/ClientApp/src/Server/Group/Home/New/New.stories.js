import React from 'react';
import { storiesOf } from '@storybook/react';
import New from './New';
import { initialState } from '../Home.reducer';

const onChangeCreateGroup = (data) => {
  console.log(data);
};
const onSubmitCreateGroup = (data) => {
  console.log(data);
};

storiesOf('Groups/New', module).add('New Group', () => (
  <New fields={initialState.fields} hasSubmit={false} onSubmitCreateGroup={onSubmitCreateGroup} onChangeCreateGroup={onChangeCreateGroup}/>
));

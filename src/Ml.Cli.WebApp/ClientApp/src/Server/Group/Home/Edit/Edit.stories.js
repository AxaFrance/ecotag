import React from 'react';
import { storiesOf } from '@storybook/react';
import Edit from './Edit';

const users = [
    {
        email: 'a@a.fr'
    },
    {
        email: 'b@a.fr'
    },
    {
        email: 'c@a.fr'
    },
];
const eligibleUsers = [
    {
        email: 'd@a.fr'
    },
    {
        email: 'e@a.fr'
    },
    {
        email: 'f@a.fr'
    },
];

const onUpdateUser = (data) => {
  console.log(data);
};
const setManageUsersModalVisible = (data) => {
  console.log(data);
};

storiesOf('Groups/Edit', module).add('Edit Group', () => (
  <Edit 
    idGroup={'002'}
    users={users}
    eligibleUsers={eligibleUsers}
    onUpdateUser={onUpdateUser}
    isManageUsersModalVisible={true}
    setManageUsersModalVisible={setManageUsersModalVisible}
  />
));

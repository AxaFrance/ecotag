import React from 'react';
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

export default {
    title: 'Groups/Edit',
    component: Edit
}

const Template = (args) => <Edit {...args}/>

export const EditGroup = Template.bind({});
EditGroup.args = {
    idGroup: '002',
    users: users,
    eligibleUsers: eligibleUsers,
    onUpdateUser: onUpdateUser,
    isManageUsersModalVisible: true,
    setManageUsersModalVisible: setManageUsersModalVisible
};

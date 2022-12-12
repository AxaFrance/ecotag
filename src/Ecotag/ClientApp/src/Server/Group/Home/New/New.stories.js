import React from 'react';
import New from './New';
import {initialState} from '../Home.reducer';

const onChangeCreateGroup = (data) => {
    console.log(data);
};
const onSubmitCreateGroup = (data) => {
    console.log(data);
};

export default {
    title: 'Groups/New',
    component: New
};

const Template = (args) => <New {...args}/>;

export const NewGroup = Template.bind({});
NewGroup.args = {
    fields: initialState.fields,
    hasSubmit: false,
    onSubmitCreateGroup: onSubmitCreateGroup,
    onChangeCreateGroup: onChangeCreateGroup
};

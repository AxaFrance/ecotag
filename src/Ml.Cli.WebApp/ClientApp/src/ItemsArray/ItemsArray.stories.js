import ItemsArray from "./index";
import Home from "../Server/Dataset/List/Home";
import {LoaderModes} from "@axa-fr/react-toolkit-all";
import { action } from '@storybook/addon-actions';
import { BrowserRouter as Router } from 'react-router-dom';

const noItems = [];
const items = [{
    "id": "0001",
    "name": "Carte verte",
    "type": "Image",
    "classification": "Publique",
    "numberFiles": 300,
    "createDate": "30/10/2019",
    "isLock": true
}];

const filters = {
    paging: {
        numberItemsByPage: 10,
        currentPage: 1,
    },
    columns: {
        name: {
            value: 1
        },
        classification: {
            value: 2
        },
        numberFiles: {
            value: 3
        },
        createDate: {
            value: 4
        }
    }
};

export default{
    title: 'ItemsArray',
    component: ItemsArray
};

const Template = (args) => <Router><ItemsArray {...args}/></Router>

export const WithItems = Template.bind({});
WithItems.args = {
    items,
    SubComponent: Home,
    loaderMode: LoaderModes.none,
    filters: filters,
    onChangePaging: action('onChangePaging'),
    onChangeSort: (e) => console.log(e)
};

export const NoItems = Template.bind({});
NoItems.args = {
    items: noItems,
    SubComponent: Home,
    loaderMode: LoaderModes.none,
    filters: filters,
    onChangePaging: action('onChangePaging'),
    onChangeSort: (e) => console.log(e)
}
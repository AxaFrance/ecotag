import {LoaderModes} from "@axa-fr/react-toolkit-all";
import { action } from '@storybook/addon-actions';
import { BrowserRouter as Router } from 'react-router-dom';
import EmptyArrayManager from "./index";
import ItemsTable from "../Server/Dataset/List/ItemsTable";

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
    title: 'EmptyArrayManager',
    component: EmptyArrayManager
};

const Template = (args) => <Router><EmptyArrayManager><ItemsTable {...args}/></EmptyArrayManager></Router>

export const WithItems = Template.bind({});
WithItems.args = {
    items,
    loaderMode: LoaderModes.none,
    filters: filters,
    onChangePaging: action('onChangePaging'),
    onChangeSort: (e) => console.log(e)
};

export const NoItems = Template.bind({});
NoItems.args = {
    items: noItems,
    loaderMode: LoaderModes.none,
    filters: filters,
    onChangePaging: action('onChangePaging'),
    onChangeSort: (e) => console.log(e)
}
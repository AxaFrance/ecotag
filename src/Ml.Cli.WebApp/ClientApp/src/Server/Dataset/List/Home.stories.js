import React from 'react';
import { action } from '@storybook/addon-actions';
import Home from './Home';
import { LoaderModes } from "@axa-fr/react-toolkit-loader";
import { BrowserRouter as Router } from 'react-router-dom';

const data = {
    "datasets": [
        {
        "id": "0001",
        "name": "Carte verte",
        "type": "Image",
        "classification": "Publique",
        "numberFiles": 300,
        "createDate": "30/10/2019",
            "isLock": true,
        },
        {
        "id": "0002",
        "name": "Carte grise",
        "type": "Image",
        "classification": "Confidentiel",
        "numberFiles": 2500,
        "createDate": "30/10/2019",
            "isLock": false,
        },
        {
        "id": "0003",
        "name": "Mail GED",
        "type": "Text",
        "classification": "Critique",
        "numberFiles": 2500,
        "createDate": "30/10/2019",
            "isLock": true,
        }
    ]
};

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
}

export default { title: 'Dataset/List/Home' };

export const withDefault = () => <Router><Home loaderMode={LoaderModes.none} filters={filters} items={data.datasets} onChangePaging={action('onChangePaging')} onChangeSort={(e) => console.log(e)} /></Router>;

export const withLoader = () => <Router><Home loaderMode={LoaderModes.get} filters={filters} items={[]} onChangePaging={action('onChangePaging')} onChangeSort={(e) => console.log(e)} /></Router>;


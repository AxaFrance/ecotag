import React from 'react';
import { action } from '@storybook/addon-actions';
import Page from './Page';
import { initialState } from './Page.container';
import { LoaderModes } from "@axa-fr/react-toolkit-loader";
import { BrowserRouter as Router } from 'react-router-dom';

const data = {
    "project": {
        "id": "0001",
        "name": "Relevé d'information",
        "numberTagToDo": 10,
        "createDate": "04/04/2011",
        "annotationType": "NER",
        "text": "Enim ad ex voluptate culpa non cillum eu mollit nulla ex pariatur duis. Commodo officia deserunt elit sint officia consequat elit laboris tempor qui est ex. Laborum magna id deserunt ut fugiat aute nulla in Lorem pariatur. Nostrud elit consectetur exercitation exercitation incididunt consequat occaecat velit voluptate nostrud sunt. Consectetur velit eu amet minim quis sunt in.",
        "labels": [{"name": "Recto", "color": "#212121", "id": 0}, {"name": "Verso", "color": "#ffbb00", "id": 1}, {"name": "Signature", "color": "#f20713", "id": 2}],
        "users": [
            {"annotationCounter": 10,
            "annotationToBeVerified": 1,
            "email": "clement.trofleau.lbc@axa.fr"},
            {"annotationCounter": 24,
            "annotationToBeVerified": 5,
            "email": "Guillaume.chervet@axa.fr"},
            {"annotationCounter": 35,
            "annotationToBeVerified": 15,
            "email": "Gille.Cruchont@axa.fr"}
        ]
      },
    "dataset":{
        "id": "0001",
        "name": "Carte verte",
        "type": "Image",
        "numberFiles": 300,
        "createDate": "30/10/2019",
        files: []
    },
    "group": {
        "id": "0001",
        "name": "developpeurs",
        "users": [
            { "email": "clement.trofleau.lbc@axa.fr" },
            { "email": "gilles.cruchon@axa.fr" },
            { "email": "francois.descamps@axa.fr" },
            { "email": "guillaume.chervet@axa.fr" }
        ]
    },
    "user": {
        role: "ADMIN"
    }
};

export default { title: 'Project/Page' };

export const withDefault = () => <Router><Page loaderMode={LoaderModes.none} user={data.user} group={data.group} users={data.users} dataset={data.dataset} project={data.project} onClick={action('onClick')} filters={initialState.filters} /></Router>;



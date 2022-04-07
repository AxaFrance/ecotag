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
        "createDate": 786698770770,
        numberCrossAnnotation: 2,
        "annotationType": "NER",
        labels:[
            {name: "first", color : "#FFF878"},
            {name: "second", color : "#878FFF"}
        ]
      },
    "dataset":{
        "id": "0001",
        "name": "Carte verte",
        "type": "Image",
        "numberFiles": 300,
        "createDate": 787978778978,
        files: []
    },
    "group": {
        "id": "0001",
        "name": "developpeurs",
        "userIds": ["0001", "0002"]
    },
    users : [
        {
            id: "0001", 
            "email":"guillaume.chervet@axa.fr",
            "subject": "S000007"
        },
        {
            id: "0002",
            "email":"lilian.delouvy@axa.fr",
            "subject": "S000005"
        }
    ],
    annotationStatus: {
        isAnnotationClosed: true,
        numberAnnotationsByUsers: [{"nameIdentifier": "S000005", numberAnnotations: 15 }, {"nameIdentifier": "S000007", numberAnnotations: 35 }],
        numberAnnotationsDone: 46,
        numberAnnotationsToDo: 288,
        percentageNumberAnnotationsDone:32
    },
    user:{roles : [], subject :"S607718"}
};

export default { title: 'Project/Page' };

export const withDefault = () => <Router><Page loaderMode={LoaderModes.none} user={data.user} group={data.group} users={data.users} dataset={data.dataset} project={data.project} annotationsStatus={data.annotationStatus} /></Router>;



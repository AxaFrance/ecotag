import React from 'react';
import { action } from '@storybook/addon-actions';
import Home from './Home';
import { initialState } from './Home.reducer';
import { LoaderModes } from "@axa-fr/react-toolkit-loader";
import { BrowserRouter as Router } from 'react-router-dom';

const data = {
    "projects": [
        {
            "id": "0001",
            "name": "Relevé d'information",
            "classification": "Publique",
            "numberTagToDo": 10,
            "createDate": "04/04/2011",
            "typeAnnotation": "NER",
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
        {
            "id": "0002",
            "name": "Carte d'identité",
            "classification": "Confidentiel",
            "numberTagToDo": 10,
            "createDate": "23/09/2014",
            "typeAnnotation": "OCR",
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
        }
    ]
};

export default { title: 'Project/Home' };

export const withDefault = () => <Router><Home loaderMode={LoaderModes.none} items={data.projects} onChangeSort={action('onChangeSort')} onClick={action('onClick')} filters={initialState.filters} /></Router>;

export const withLoader = () => <Router><Home loaderMode={LoaderModes.get} items={[]} onChangeSort={action('onChangeSort')} onClick={action('onClick')} filters={initialState.filters} /></Router>;


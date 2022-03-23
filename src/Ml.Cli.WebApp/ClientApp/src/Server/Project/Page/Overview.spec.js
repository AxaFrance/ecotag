import '@testing-library/jest-dom/extend-expect';
import React from 'react';
import { render, waitFor } from '@testing-library/react';
import {Overview} from './Overview';
import {BrowserRouter as Router} from "react-router-dom";

describe('Overview', () => {
    it('Overview render correctly', async () => {
        const project = {
            "id": "0001",
            "name": "Relevé d'information",
            "datasetId": "0004",
            "numberTagToDo": 10,
            "createDate": new Date("04-04-2011").getTime(),
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
                    "email": "Gilles.Cruchon@axa.fr"}
            ]
        };
        const dataset = {
            "id": "0001",
            "name": "Carte verte",
            "type": "Image",
            "numberFiles": 300,
            "createDate": new Date("10-30-2019").getTime(),
            files: []
        };
        const group = {name: "groupName"};
        const { asFragment, getByText } = render(<Router><Overview dataset={dataset} project={project} group={group}/></Router>);
        const messageEl = await waitFor(() => getByText('Informations générales'));
        expect(messageEl).toHaveTextContent(
            'Informations générales'
        );
        expect(asFragment()).toMatchSnapshot();
    });
});


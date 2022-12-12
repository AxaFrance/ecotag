import '@testing-library/jest-dom/extend-expect';
import React from 'react';
import {render, waitFor} from '@testing-library/react';
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
            "annotationType": "NER",
            annotationStatus: {
                percentageNumberAnnotationsDone: 10
            }
        };
        const dataset = {
            "id": "0001",
            "name": "Carte verte",
            "type": "Image",
            "numberFiles": 300,
            "createDate": new Date("10-30-2019").getTime(),
            files: []
        };
        const group = {
            "id": "0001",
            "name": "developpeurs",
            "userIds": ["0001", "0002"]
        };
        const users = [
            {
                id: "0001",
                "email": "guillaume.chervet@axa.fr",
                "nameIdentifier": "S000007"
            },
            {
                id: "0002",
                "email": "lilian.delouvy@axa.fr",
                "nameIdentifier": "S000005"
            }
        ];
        const annotationStatus = {
            isAnnotationClosed: true,
            numberAnnotationsByUsers: [{
                "nameIdentifier": "S000005",
                numberAnnotations: 15
            }, {"nameIdentifier": "S000007", numberAnnotations: 35}],
            numberAnnotationsDone: 46,
            numberAnnotationsToDo: 288,
            percentageNumberAnnotationsDone: 32
        };
        const {asFragment, getByText} = render(<Router><Overview dataset={dataset} project={project} group={group}
                                                                 annotationsStatus={annotationStatus}
                                                                 users={users}/></Router>);
        const messageEl = await waitFor(() => getByText('Informations générales'));
        expect(messageEl).toHaveTextContent(
            'Informations générales'
        );
        expect(asFragment()).toMatchSnapshot();
    });
});


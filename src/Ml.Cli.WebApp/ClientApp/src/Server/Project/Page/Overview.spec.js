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
            "annotationType": "NER",
            annotationStatus:{
                percentageNumberAnnotationsDone:10
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
        const group = {name: "groupName"};
        const { asFragment, getByText } = render(<Router><Overview dataset={dataset} project={project} group={group}/></Router>);
        const messageEl = await waitFor(() => getByText('Informations générales'));
        expect(messageEl).toHaveTextContent(
            'Informations générales'
        );
        expect(asFragment()).toMatchSnapshot();
    });
});


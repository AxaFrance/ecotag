import '@testing-library/jest-dom/extend-expect';
import React from 'react';
import { render, waitFor } from '@testing-library/react';
import { HomeContainer } from './Home.container';
import {BrowserRouter as Router} from "react-router-dom";

const fetch = async(url, config) => {

    if(url.includes("projects/0001")){
        return{
            ok: true, json: () => Promise.resolve({
                "id": "0001",
                "name": "Relevé d'information",
                "groupId": "0001",
                "numberTagToDo": 10,
                "createDate": new Date("04-04-2011").getTime(),
                "annotationType": "NER",
                annotationStatus:{
                    percentageNumberAnnotationsDone : 88,
                    numberAnnotationsToDo: 2000,
                    numberAnnotationsDone: 40
                }
            })
        }
    }
    if(url.includes("projects")){
        return{
            ok: true, json: () => Promise.resolve([{
                "id": "0001",
                "name": "Relevé d'information",
                "groupId": "0001",
                "numberTagToDo": 10,
                "createDate": new Date("04-04-2011").getTime(),
                "annotationType": "NER",
            }])
        }
    }
    return {
        ok: true, json: () => Promise.resolve([{
            "id": "0001",
            "name": "groupName"
        }])
    };
};

describe('Home.container', () => {
  it('HomeContainer render correctly', async () => {
    const { asFragment, getByText } = render(<Router><HomeContainer fetch={fetch} /></Router>);
    const messageEl = await waitFor(() => getByText('02/01/0001'));
    expect(messageEl).toHaveTextContent(
      '02/01/0001'
    );
    expect(asFragment()).toMatchSnapshot();
  });
});


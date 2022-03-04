import '@testing-library/jest-dom/extend-expect';
import React from 'react';
import {fireEvent, render, screen, waitFor} from '@testing-library/react';
import {MemoryRouter, Route} from "react-router-dom";
import {AnnotationContainer} from "./Annotation.container";
import {fetch} from "./Annotation.stories";

describe('Annotation.container', () => {

    it('should annotate from start until end', async() => {

       const environment = {apiUrl: "/server/{path}"}
       const { getByText } = render(<MemoryRouter initialEntries={["/projects/0005/start"]}>
          <Route path="/:projectId/0005/:documentId">
              <AnnotationContainer fetch={fetch} environment={environment} />
          </Route>
          </MemoryRouter>);
        let imagefilename = await waitFor(() => getByText('1.PNG'));
        expect(imagefilename).toHaveTextContent(
            '1.PNG'
        );
        let annotation1 = screen.queryByText("annotation1");
        fireEvent.change(annotation1, {target: {value: 'toto'}});
        
        const fireSumbit = () => {
            const item = screen.queryByText("Submit");
            fireEvent.click(item);
        };

        fireSumbit();
        imagefilename = await waitFor(() => getByText('2.PNG'));
        expect(imagefilename).toHaveTextContent(
            '2.PNG'
        );

        let buttonNext = await waitFor(() => getByText('Suivant'));
        fireEvent(
            buttonNext,
            new MouseEvent('click', {
                bubbles: true,
                cancelable: true,
            }),
        )
        imagefilename = await waitFor(() => getByText('3.PNG'));
        expect(imagefilename).toHaveTextContent(
            '3.PNG'
        );

        fireEvent(
            buttonNext,
            new MouseEvent('click', {
                bubbles: true,
                cancelable: true,
            }),
        )
        imagefilename = await waitFor(() => getByText('4.PNG'));
        expect(imagefilename).toHaveTextContent(
            '4.PNG'
        );

        fireSumbit();

        const finalMessage = /Merci beaucoup !/
        let alertInfo = await waitFor(() => getByText(finalMessage));
        
        expect(alertInfo).toHaveTextContent(
            finalMessage
        );
    });

    it('should annotate from defined idDocument', async() => {

        const environment = {apiUrl: "/server/{path}"}
        const { getByText } = render(<MemoryRouter initialEntries={["/projects/0005/1"]}>
            <Route path="/:projectId/0005/:documentId">
                <AnnotationContainer fetch={fetch} environment={environment} />
            </Route>
        </MemoryRouter>);
        let imagefilename = await waitFor(() => getByText('1.PNG'));
        expect(imagefilename).toHaveTextContent(
            '1.PNG'
        );

        let annotation1 = await waitFor(() => getByText('annotation1'));
        fireEvent.change(annotation1, {target: {value: 'toto'}});

        const fireSumbit = () => {
            const item = screen.queryByText("Submit");
            fireEvent.click(item);
        };

        fireSumbit();
        imagefilename = await waitFor(() => getByText('2.PNG'));
        expect(imagefilename).toHaveTextContent(
            '2.PNG'
        );

        let buttonPrevious = await waitFor(() => getByText('Précédent'));
        fireEvent(
            buttonPrevious,
            new MouseEvent('click', {
                bubbles: true,
                cancelable: true,
            }),
        )
        annotation1 = await waitFor(() => getByText('toto'));
        expect(annotation1).toHaveTextContent(
            'toto'
        );
       
    });

});


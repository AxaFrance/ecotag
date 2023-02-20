import React from 'react';
import {createMemoryHistory} from "history";
import {BrowserRouter} from 'react-router-dom';
import {render, screen, waitFor} from '@testing-library/react';
import {HomeContainer} from './Home.container';
import sleep from "../../../sleep";
import {fireEvent} from "@testing-library/dom";
import {changeProjectTranslationLanguage} from "../../../translations/useProjectTranslation";

describe('Home.container for groups', () => {

    const history = createMemoryHistory({initialEntries: ['/']});
    const givenGroups = [{
        id: "0001",
        name: "developers",
        userIds: ["0001", "0002"]
    }];
    const givenFetch = async (url) => {
        await sleep(1);
        switch (url) {
            case "groups":
                return {ok: true, json: () => Promise.resolve(givenGroups)};
            default:
                return {ok: true,
                    json: () => Promise.resolve([{id: "0001", email: "gilles.cruchon@axa.fr"}, {
                        id: "0002",
                        email: "guillaume.chervet@axa.fr"
                    }])
                };
        }
    };

    it('HomeContainer render correctly the groups', async () => {
        const {container, asFragment, getByText} = render(<BrowserRouter history={history}><HomeContainer
            fetch={givenFetch}/></BrowserRouter>);
        const messageEl = await waitFor(() => getByText('developers'));
        expect(messageEl).toHaveTextContent(
            'developers'
        );
        expect(asFragment()).toMatchSnapshot();

        const updateButton = container.querySelector('.glyphicon-pencil');
        fireEvent.click(updateButton);
        await waitFor(() => expect(getByText(/Remove/i)).not.toBeNull());

        const submitUpdateButton = screen.getByLabelText(/SubmitUpdate/i);
        fireEvent.click(submitUpdateButton);
        await waitFor(() => expect(screen.queryByText(/Remove/i)).toBeNull());
    });
    describe('Home.container translation', () => {
        it('should render groups correctly with english translation', async () => {
            const {asFragment, getByText} = render(<BrowserRouter history={history}><HomeContainer
                fetch={givenFetch}/></BrowserRouter>);
            const messageEl = await waitFor(() => getByText('developers'));
            expect(messageEl).toHaveTextContent(
                'developers'
            );
            expect(asFragment()).toMatchSnapshot();
        });
    })
    it('should render groups correctly with french translation', async () => {
        changeProjectTranslationLanguage('fr');
        const {asFragment, getByText} = render(<BrowserRouter history={history}><HomeContainer
            fetch={givenFetch}/></BrowserRouter>);
        const messageEl = await waitFor(() => getByText('developers'));
        expect(messageEl).toHaveTextContent(
            'developers'
        );
        expect(asFragment()).toMatchSnapshot();
    });
});


import {render, waitFor} from '@testing-library/react';
import {Edit, EditContainer} from "./Edit.container";
import {BrowserRouter as Router} from "react-router-dom";

describe('Edit.container', () => {
    describe('init', () => {
        it('should init correctly', async () => {
            const fetch = () => {
                return {
                    status: 200,
                    json: () => Promise.resolve({id: "0001", name: "testName", createDate: Date.now(), isLocked: true, type: "image", files: []})
                };
            };
            const {asFragment, getByText} = render(<Router><EditContainer fetch={fetch}/></Router>);
            await waitFor(() => expect(getByText(/Verrouiller/i)));
            expect(asFragment()).toMatchSnapshot();
        });
        it('should init with forbidden message', async () => {
            const fetch = () => {
                return {
                    status: 403,
                };
            };
            const {asFragment, getByText} = render(<Router><EditContainer fetch={fetch}/></Router>);
            await waitFor(() => expect(getByText(/Vous n'avez pas le droit d'accéder à cette ressource./i)));
            expect(asFragment()).toMatchSnapshot();
        });
        it('should init with error message', async () => {
            const fetch = () => {
                return {
                    status: 500,
                };
            };
            const {asFragment, getByText} = render(<Router><EditContainer fetch={fetch}/></Router>);
            await waitFor(() => expect(getByText(/problème/i)));
            expect(asFragment()).toMatchSnapshot();
        });
    });
});

describe('Edit', () => {
    const state = {
        files: {
            filesSend: [],
            filesSendError: [],
            filesLoad: [],
            filesLoadError: [],
            paging: {itemByPages: 50, currentPages: 1}
        },
        openLockModal: false,
        dataset: {
            id: '0001',
            name: 'datasetName',
            createDate: 0,
            type: 'Classification',
            isLock: false
        }
    };

    const lock = {
        onSubmit: () => {},
        onCancel: () => {},
        onLockDataset: () => {}
    };

    it('should render correctly', () => {
        const {asFragment} = render(<Router><Edit state={state} setState={() => {}} fetch={() => {}} lock={lock}/></Router>);
        expect(asFragment()).toMatchSnapshot();
    });
});

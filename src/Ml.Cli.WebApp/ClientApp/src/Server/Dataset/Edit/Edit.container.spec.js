import { render } from '@testing-library/react';
import {Edit} from "./Edit.container";
import {BrowserRouter as Router} from "react-router-dom";

describe('Edit.container', () => {
    
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
})
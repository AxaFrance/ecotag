import {fireEvent, render, waitFor} from '@testing-library/react';
import FileList from "./FileList";
import {Locked} from "../Dataset.service";
import {resilienceStatus} from "../../shared/Resilience";

describe('FileList', () => {
    const givenState = {
        files: {
            filesSend: [{file: {size: 0, name: "testFile.png", type: 'Image', id: '0001'}}],
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
            type: 'Image',
            locked: Locked.None
        }
    };
    it('should render correctly', async () => {
        const {asFragment, getByText} = render(<FileList fetch={() => {}} state={givenState} setState={() => {}}/>);
        expect(asFragment()).toMatchSnapshot();
        const tabButton = getByText(/Liste des fichiers/i);
        fireEvent.click(tabButton);
        await waitFor(() => expect(getByText(/testFile.png/i)).not.toBeNull());
        expect(asFragment()).toMatchSnapshot();
        
    });
    
    describe('deleteFile', () => {
        
        const testCases = [
            [403, resilienceStatus.FORBIDDEN],
            [500, resilienceStatus.ERROR]
        ];
        
        it('should delete file correctly', async () => {
            const givenFetch = jest.fn()
                .mockResolvedValueOnce({status: 200});
            const givenSetState = jest.fn();
            const {getByText, getByTitle} = render(<FileList fetch={givenFetch} state={givenState} setState={givenSetState}/>);
            const tabButton = getByText(/Liste des fichiers/i);
            fireEvent.click(tabButton);
            await waitFor(() => expect(getByText(/testFile.png/i)).not.toBeNull());
            const deleteButton = getByTitle(/Supprimer/i);
            fireEvent.click(deleteButton);
            await waitFor(() => expect(givenSetState).toHaveBeenCalled());
            expect(givenSetState).toHaveBeenCalledWith({...givenState, files: {...givenState.files, filesSend: []}, status: resilienceStatus.SUCCESS});
        });
        test.each(testCases)(
            "given %p response, returns related resilience status",
            async (returnedStatus, expectedStatus) => {
                const givenFetch = jest.fn()
                    .mockResolvedValueOnce({status: returnedStatus});
                const givenSetState = jest.fn();
                const {getByText, getByTitle} = render(<FileList fetch={givenFetch} state={givenState} setState={givenSetState}/>);
                const tabButton = getByText(/Liste des fichiers/i);
                fireEvent.click(tabButton);
                await waitFor(() => expect(getByText(/testFile.png/i)).not.toBeNull());
                const deleteButton = getByTitle(/Supprimer/i);
                fireEvent.click(deleteButton);
                await waitFor(() => expect(givenSetState).toHaveBeenCalled());
                expect(givenSetState).toHaveBeenCalledWith({...givenState, status: expectedStatus});
            }
        );
    });
})
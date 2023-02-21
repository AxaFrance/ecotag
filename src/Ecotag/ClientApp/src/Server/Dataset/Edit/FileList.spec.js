import {fireEvent, render, waitFor} from '@testing-library/react';
import FileList from './FileList';
import {Locked} from '../Dataset.service';
import {resilienceStatus} from '../../shared/Resilience';
import {changeProjectTranslationLanguage} from '../../../translations/useProjectTranslation';

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

    const renderComponentThenNavigateAndCheckSnapshots = async (language, expectedText) => {
        changeProjectTranslationLanguage(language);
        const {asFragment, getByText} = render(<FileList
            fetch={() => {}}
            state={givenState}
            setState={() => {}}/>);

        expect(asFragment()).toMatchSnapshot();
        const regex = new RegExp(expectedText, "i");
        const tabButton = getByText(regex);
        fireEvent.click(tabButton);
        await waitFor(() => expect(getByText(/testFile.png/i)).not.toBeNull());
        expect(asFragment()).toMatchSnapshot();
    };

    it('should render correctly in english', async () => {
        await renderComponentThenNavigateAndCheckSnapshots("en", "Files list");
    });
    it('should render correctly in french', async () => {
        await renderComponentThenNavigateAndCheckSnapshots("fr", "Liste des fichiers");
    })

    describe('deleteFile', () => {

        beforeAll(() => changeProjectTranslationLanguage('en'));

        const testCases = [
            [403, resilienceStatus.FORBIDDEN],
            [500, resilienceStatus.ERROR]
        ];

        it('should delete file correctly', async () => {
            const givenFetch = jest.fn()
                .mockResolvedValueOnce({status: 200});
            const givenSetState = jest.fn();
            const {getByText, getByTitle} = render(<FileList fetch={givenFetch} state={givenState}
                                                             setState={givenSetState}/>);
            const tabButton = getByText(/Files list/i);
            fireEvent.click(tabButton);
            await waitFor(() => expect(getByText(/testFile.png/i)).not.toBeNull());
            const deleteButton = getByTitle(/Delete/i);
            fireEvent.click(deleteButton);
            await waitFor(() => expect(givenSetState).toHaveBeenCalled());
            expect(givenSetState).toHaveBeenCalledWith({
                ...givenState,
                files: {...givenState.files, filesSend: []},
                status: resilienceStatus.SUCCESS
            });
        });
        test.each(testCases)(
            "given %p response, returns related resilience status",
            async (returnedStatus, expectedStatus) => {
                const givenFetch = jest.fn()
                    .mockResolvedValueOnce({status: returnedStatus});
                const givenSetState = jest.fn();
                const {getByText, getByTitle} = render(<FileList fetch={givenFetch} state={givenState}
                                                                 setState={givenSetState}/>);
                const tabButton = getByText(/Files list/i);
                fireEvent.click(tabButton);
                await waitFor(() => expect(getByText(/testFile.png/i)).not.toBeNull());
                const deleteButton = getByTitle(/Delete/i);
                fireEvent.click(deleteButton);
                await waitFor(() => expect(givenSetState).toHaveBeenCalled());
                expect(givenSetState).toHaveBeenCalledWith({...givenState, status: expectedStatus});
            }
        );
    });

    describe('downloadAsync', () => {

        beforeAll(() => changeProjectTranslationLanguage('en'));

        const testCases = [
            [403, resilienceStatus.FORBIDDEN],
            [500, resilienceStatus.ERROR]
        ];

        test.each(testCases)(
            "given %p response, returns related resilience status",
            async (returnedStatus, expectedStatus) => {
                const givenFetch = jest.fn()
                    .mockResolvedValueOnce({status: returnedStatus});
                const givenSetState = jest.fn();
                const {getByText} = render(<FileList fetch={givenFetch} state={givenState} setState={givenSetState}/>);
                const tabButton = getByText(/Files list/i);
                fireEvent.click(tabButton);
                await waitFor(() => expect(getByText(/testFile.png/i)).not.toBeNull());
                const downloadButton = getByText(/testFile.png/i);
                fireEvent.click(downloadButton);
                await waitFor(() => expect(givenSetState).toHaveBeenCalled());
                expect(givenSetState).toHaveBeenCalledWith({...givenState, status: expectedStatus});
            }
        );
    });
})
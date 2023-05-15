import {render} from '@testing-library/react';
import {FileUpload} from "./FileUpload";
import {changeProjectTranslationLanguage} from "../../../useProjectTranslation";

describe('FileUpload', () => {

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
            type: 'Image',
            isLock: false
        }
    };

    const cases = ["Image", "Text", "Eml"];
    test.each(cases)(
        "given %p should render correctly in english",
        (datasetType) => {
            changeProjectTranslationLanguage('en');
            const newState = {...state, dataset: {...state.dataset, type: datasetType}};
            const {asFragment} = render(<FileUpload
                state={newState}
                setState={() => {}}
                fetch={() => {}}/>);
            expect(asFragment()).toMatchSnapshot();
        }
    );

    it('should render correctly in french', () => {
        changeProjectTranslationLanguage('fr');
        const newState = {...state, dataset: {...state.dataset, type: "Image"}};
        const {asFragment} = render(<FileUpload
            state={newState}
            setState={() => {}}
            fetch={() => {}}/>);
        expect(asFragment()).toMatchSnapshot();
    });
})
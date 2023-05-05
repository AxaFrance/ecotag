import ItemsTable from './ItemsTable';
import {render} from '@testing-library/react';
import {LoaderModes} from '@axa-fr/react-toolkit-all';
import {changeProjectTranslationLanguage} from '../../../useProjectTranslation';

const items = [{
    id: "0001",
    name: "Green card",
    type: "Image",
    classification: "Public",
    numberFiles: 300,
    createDate: new Date("01-28-2022").getTime()
}];

const filters = {
    paging: {
        numberItemsByPage: 10,
        currentPage: 1,
    },
    columns: {
        name: {
            value: 1
        },
        classification: {
            value: 2
        },
        numberFiles: {
            value: 3
        },
        createDate: {
            value: 4
        }
    }
};

describe("Check Dataset ItemsTable behaviour", () => {

    const renderComponentAndCheckSnapshot = () => {
        const {asFragment} = render(<ItemsTable items={items} filters={filters} loaderMode={LoaderModes.none}
                                                onChangeSort={() => {
                                                }} onChangePaging={() => {
        }}/>);

        expect(asFragment()).toMatchSnapshot();
    }

    it("should render correctly in english", () => {
        changeProjectTranslationLanguage('en');
        renderComponentAndCheckSnapshot();
    });
    it("should render correctly in french", () => {
        changeProjectTranslationLanguage('fr');
        renderComponentAndCheckSnapshot();
    });
});

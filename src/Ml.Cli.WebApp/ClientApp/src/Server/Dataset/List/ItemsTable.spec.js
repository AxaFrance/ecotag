import ItemsTable from "./ItemsTable";
import {render} from "@testing-library/react";
import {LoaderModes} from "@axa-fr/react-toolkit-all";

const items = [{
    id: "0001",
    name: "Carte verte",
    type: "Image",
    classification: "Publique",
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
    
    test("Should render correctly", () => {
        const {asFragment} = render(<ItemsTable items={items} filters={filters} loaderMode={LoaderModes.none} onChangeSort={() => {}} onChangePaging={() => {}}/>);
        
        expect(asFragment()).toMatchSnapshot();
    });
    
});

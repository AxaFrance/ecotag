import {render} from "@testing-library/react";
import {LoaderModes} from "@axa-fr/react-toolkit-all";
import ItemsTable from "./ItemsTable";

const items = [{
    id: "0001",
    name: "Carte verte",
    type: "Image",
    classification: "Publique",
    numberFiles: 300,
    createDate: new Date("10-30-2019").getTime()
}];

const filters = {
    paging: {
        numberItemsByPage: 10,
            currentPage: 1,
    },
    filterValue: null,
        columns: {
        name: { value: null, timeLastUpdate: null },
        classification: { value: null, timeLastUpdate: null },
        createDate: { value: 'desc', timeLastUpdate: new Date() },
        typeAnnotation: { value: null, timeLastUpdate: null },
        numberTagToDo: { value: null, timeLastUpdate: null },
        numberCrossAnnotation: {value: null}
    },
};

describe("Check Project ItemsTable behaviour", () => {
    
    test("Chould render correctly", async () => {
        const {asFragment} = render(<ItemsTable items={items} filters={filters} loaderMode={LoaderModes.none} onChangePaging={() => {}} onChangeSort={() => {}}/>);

        expect(asFragment()).toMatchSnapshot();
    })
    
})